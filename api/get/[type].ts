import { VercelRequest, VercelResponse } from "@vercel/node";
import setHeaders from "../../_utils/set-headers";
import { setupResponseData } from "../../_utils/setup-response";
import { supabase } from "../../_utils/supabase";
import { verifyRequest } from "../../_utils/verify";
import { queryTypes as queryTypesList } from "../../_utils/routes-listing";
import { getSchemas, paramsToObject, validate } from "../../_utils/validation";

import allHandler from "./_requests/all";
import byidHandler from "./_requests/byid";
import wateredHandler from "./_requests/watered";
import treesbyidsHandler from "./_requests/treesbyids";
import wateredandadoptedHandler from "./_requests/wateredandadopted";
import { checkDataError } from "../../_utils/data-error-response";

export const method = "GET";
const queryTypes = Object.keys(queryTypesList[method]);

// api/[type].ts -> /api/lee
// req.query.type -> "lee"
export default async function handler(
	request: VercelRequest,
	response: VercelResponse
): Promise<VercelResponse> {
	setHeaders(response, method);
	if (request.method === "OPTIONS") {
		return response.status(200).end();
	}
	const { type } = request.query;
	if (Array.isArray(type)) {
		return response.status(400).json({ error: `${type} needs to be a string` });
	}
	if (!queryTypes.includes(type)) {
		return response.status(404).json({ error: `invalid route ${type}` });
	}
	if (!request.url) {
		return response.status(500).json({ error: "request url not available" });
	}
	const params = paramsToObject(
		request.url
			.replace(`/${method.toLowerCase()}/${type}`, "")
			.replace(`/?type=${type}`, "")
	);
	const [paramsAreValid, validationError] = validate(params, getSchemas[type]);
	if (!paramsAreValid) {
		return response
			.status(400)
			.json({ error: `invalid params: ${JSON.stringify(validationError)}` });
	}

	switch (type) {
		default:
			return response.status(400).json({ error: "invalid query type" });
		case "byid": {
			return await byidHandler(request, response);
		}
		case "watered": {
			return await wateredHandler(request, response);
		}
		case "treesbyids": {
			return await treesbyidsHandler(request, response);
		}
		case "wateredandadopted": {
			return await wateredandadoptedHandler(request, response);
		}
		case "all": {
			return await allHandler(request, response);
		}
		case "countbyage": {
			const { start: startStr, end: endStr } = <{ start: string; end: string }>(
				request.query
			);
			const start = isNaN(parseInt(startStr, 10))
				? undefined
				: parseInt(startStr, 10);
			const end = isNaN(parseInt(endStr, 10))
				? undefined
				: parseInt(endStr, 10);
			if (start === undefined) {
				return response
					.status(400)
					.json({ error: "start needs to be a number" });
			}
			if (end === undefined) {
				return response.status(400).json({ error: "end needs to be a number" });
			}
			// FIXME: Request could be done from the frontend
			const { data: count, error } = await supabase.rpc("count_by_age", {
				start_year: start,
				end_year: end,
			});

			if (error) {
				return response.status(500).json({ error });
			}

			if (!count) {
				return response
					.status(500)
					.json({ error: "could not call function count_by_age" });
			}
			const result = setupResponseData({
				url: request.url,
				data: { count },
				error,
			});
			return response.status(200).json(result);
		}
		case "byage": {
			const { start: startStr, end: endStr } = <{ start: string; end: string }>(
				request.query
			);

			const start = isNaN(parseInt(startStr, 10))
				? undefined
				: parseInt(startStr, 10);
			const end = isNaN(parseInt(endStr, 10))
				? undefined
				: parseInt(endStr, 10);
			if (start === undefined) {
				return response
					.status(400)
					.json({ error: "start needs to be a number" });
			}
			if (end === undefined) {
				return response.status(400).json({ error: "end needs to be a number" });
			}
			// FIXME: Request could be done from the frontend
			const { data, error } = await supabase
				.from("trees")
				.select("id")
				.gte("pflanzjahr", start)
				.lte("pflanzjahr", end)
				.order("id", { ascending: true });

			checkDataError({
				data,
				error,
				response,
				errorMessage: "trees not found",
			});

			const result = setupResponseData({
				url: request.url,
				data,
				error,
			});

			return response.status(200).json(result);
		}
		//TODO: [GDK-218] API (with supabase) Should GET lastwatered be only available for authenticated users?
		case "lastwatered": {
			const { id } = <{ id: string }>request.query;

			// FIXME: Request could be done from the frontend
			const { data, error } = await supabase
				.from("trees_watered")
				.select("id,timestamp,amount,username,tree_id")
				.eq("tree_id", id)
				.order("timestamp", { ascending: false });

			if (error) {
				return response.status(500).json({ error });
			}

			if (!data) {
				return response.status(500).json({ error: "trees not found" });
			}
			const result = setupResponseData({
				url: request.url,
				data,
				error,
			});
			return response.status(200).json(result);
		}
		// All requests below this line are only available for authenticated users
		case "adopted": {
			const authorized = await verifyRequest(request);
			if (!authorized) {
				return response.status(401).json({ error: "unauthorized" });
			}
			const { uuid } = <{ uuid: string }>request.query;
			const { data, error } = await supabase
				.from("trees_adopted")
				.select("tree_id,uuid")
				.eq("uuid", uuid)
				.order("uuid", { ascending: true });

			if (error) {
				return response.status(500).json({ error });
			}

			if (!data) {
				return response.status(500).json({ error: "trees not found" });
			}
			const result = setupResponseData({
				url: request.url,
				data: data.map((tree) => tree.tree_id),
				error,
			});

			return response.status(200).json(result);
		}
		case "istreeadopted": {
			const authorized = await verifyRequest(request);
			if (!authorized) {
				return response.status(401).json({ error: "unauthorized" });
			}
			const { uuid, id } = <{ uuid: string; id: string }>request.query;

			const { data, error } = await supabase
				.from("trees_adopted")
				.select("uuid,tree_id")
				.eq("uuid", uuid)
				.eq("tree_id", id);

			if (error) {
				return response.status(500).json({ error });
			}

			if (!data) {
				return response.status(500).json({ error: "trees not found" });
			}

			const result = setupResponseData({
				url: request.url,
				data: data.length > 0 ? true : false,
				error,
			});

			return response.status(200).json(result);
		}

		case "wateredbyuser": {
			const authorized = await verifyRequest(request);
			if (!authorized) {
				return response.status(401).json({ error: "unauthorized" });
			}
			const { uuid } = <{ uuid: string }>request.query;

			const { data, error } = await supabase
				.from("trees_watered")
				.select("*")
				.eq("uuid", uuid)
				.order("timestamp", { ascending: false });

			if (error) {
				return response.status(500).json({ error });
			}

			if (!data) {
				return response.status(500).json({ error: "trees not found" });
			}
			const result = setupResponseData({
				url: request.url,
				data,
				error,
			});
			return response.status(200).json(result);
		}
	}
}
