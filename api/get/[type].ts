import { VercelRequest, VercelResponse } from "@vercel/node";
import type { Point } from "geojson";
import setHeaders from "../../_utils/set-headers";
import { setupResponseData } from "../../_utils/setup-response";
import { supabase } from "../../_utils/supabase";
import { verifyRequest } from "../../_utils/verify";
import { queryTypes as queryTypesList } from "../../_utils/routes-listing";
import { getSchemas, paramsToObject, validate } from "../../_utils/validation";
import { getEnvs } from "../../_utils/envs";

const countOptions: {
	head?: boolean | undefined;
	count?: "exact" | "planned" | "estimated" | undefined;
} = { count: "exact", head: true };

const method = "GET";
const queryTypes = Object.keys(queryTypesList[method]);
const { SUPABASE_MAX_ROWS } = getEnvs();

// api/[name].ts -> /api/lee
// req.query.name -> "lee"
export default async function handler(
	request: VercelRequest,
	response: VercelResponse
) {
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
			const { id } = request.query;

			if (countError) {
				return response.status(500).json({ error: countError });
			}
			if (!count) {
				return response.status(404).json({ error: "could not count trees" });
			}
			if (count > SUPABASE_MAX_ROWS) {
				console.info(
					`[api/get/${type}] count ${count} exceeds SUPABASE_MAX_ROWS ${SUPABASE_MAX_ROWS}`
				);
			} else {
				console.info(`[api/get/${type}] count ${count}`);
			}

			// FIXME: Request could be done from the frontend

			const { data, error } = await supabase
				.from("trees")
				.select("*")
				.eq("id", id);

			if (error) {
				return response.status(500).json({ error });
			}

			if (!data) {
				return response.status(500).json({ error: "tree not found" });
			}
			const result = setupResponseData({
				url: request.url,
				data,
				error,
			});
			return response.status(200).json(result);
		}
		case "watered": {
			const { count, error: countError } = await supabase
				.from("trees_watered")
				.select("tree_id", countOptions)
				.order("tree_id", { ascending: true });
			if (countError) {
				return response.status(500).json({ error: countError });
			}
			if (!count) {
				return response.status(404).json({ error: "could not count trees" });
			}
			if (count > SUPABASE_MAX_ROWS) {
				console.info(
					`[api/get/${type}] count ${count} exceeds SUPABASE_MAX_ROWS ${SUPABASE_MAX_ROWS}`
				);
			} else {
				console.info(`[api/get/${type}] count ${count}`);
			}

			// FIXME: Request could be done from the frontend
			const { data, error } = await supabase
				.from("trees_watered")
				.select("tree_id")
				.order("tree_id", { ascending: true });

			if (error) {
				return response.status(500).json({ error });
			}

			if (!data) {
				return response.status(500).json({ error: "trees_watered not found" });
			}
			const result = setupResponseData({
				url: request.url,
				data,
				error,
			});
			return response.status(200).json(result);
		}
		case "treesbyids": {
			const { tree_ids } = <{ tree_ids: string }>request.query;
			// FIXME: Request could be done from the frontend
			const trimmed_tree_ids = tree_ids.split(",").map((id) => id.trim());
			const { data, error } = await supabase
				.from("trees")
				.select("*")
				.in("id", trimmed_tree_ids)
				.order("id", { ascending: true });

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
		case "wateredandadopted": {
			// FIXME: Request could be done from the frontend
			const { data, error } = await supabase.rpc("get_watered_and_adopted");

			if (error) {
				return response.status(500).json({ error });
			}

			if (!data) {
				return response.status(500).json({
					error: "function trees_watered_and_adopted not found",
				});
			}
			const result = setupResponseData({
				url: request.url,
				data,
				error,
			});
			return response.status(200).json(result);
		}
		case "all": {
			let { limit: limit_str, offset: offset_str } = <
				{ limit: string; offset: string }
			>request.query;

			if (!limit_str) {
				limit_str = "100";
			}
			if (!offset_str) {
				offset_str = "0";
			}
			const limit = parseInt(limit_str, 10);
			const offset = parseInt(offset_str, 10);
			if (isNaN(limit)) {
				return response
					.status(400)
					.json({ error: "limit needs to be a number" });
			}
			if (isNaN(offset)) {
				return response
					.status(400)
					.json({ error: "offset needs to be a number" });
			}
			if (limit > SUPABASE_MAX_ROWS) {
				return response.status(400).json({
					error: `limit needs to be smaller than ${SUPABASE_MAX_ROWS}`,
				});
			}
			// FIXME: Request could be done from the frontend
			const { data, error } = await supabase
				.from("trees")
				.select<
					"id,radolan_sum,geom",
					{
						id: string;
					} & {
						radolan_sum: number | null;
					} & {
						geom: Point;
					}
				>("id,radolan_sum,geom")
				.range(offset, offset + limit)
				.order("id", { ascending: true });

			if (error) {
				return response.status(500).json({ error });
			}

			if (!data) {
				return response.status(500).json({ error: "trees not found" });
			}
			// to match the old structure we need to transform the data a little
			// FIXME: [GDK-217] API (with supabase): GET "all" should work with result that is returned without transforming the data into the current structure
			const watered = data.map((tree) => {
				return [
					tree.id,
					tree.geom.coordinates[0] ? tree.geom.coordinates[0] : 0,
					tree.geom.coordinates[1] ? tree.geom.coordinates[1] : 0,
					tree.radolan_sum ? tree.radolan_sum : 0,
				];
			});

			const result = setupResponseData({
				url: request.url,
				data: watered,
				error,
			});
			return response.status(200).json(result);
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
