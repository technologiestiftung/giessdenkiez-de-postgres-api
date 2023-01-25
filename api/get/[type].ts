import { VercelRequest, VercelResponse } from "@vercel/node";
import setHeaders from "../_utils/set-headers";
import { setupResponseData } from "../_utils/setup-response";
import { supabase } from "../_utils/supabase";
import type { Point } from "geojson";
import { verifyRequest } from "../_utils/verify";
import { PostgrestError } from "@supabase/supabase-js";
const queryTypes = [
	"byid",
	"treesbyids",
	"adopted",
	"countbyage",
	"watered",
	"all",
	"istreeadopted",
	"wateredandadopted",
	"byage",
	"lastwatered",
	"wateredbyuser",
];

function returnErrorResponse(
	response: VercelResponse,
	error: PostgrestError | null,
	status: number
) {
	if (!error) return;
	return response.status(status).json({ error });
}

// api/[name].ts -> /api/lee
// req.query.name -> "lee"
export default async function handler(
	request: VercelRequest,
	response: VercelResponse
) {
	setHeaders(response, "GET");
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

	switch (type) {
		default:
			return response.status(400).json({ error: "invalid query type" });
		case "byid": {
			const { id } = request.query;

			if (!id) {
				return response.status(400).json({ error: "id query is required" });
			}
			const { data, error } = await supabase
				.from("trees")
				.select("*")
				.eq("id", id);

			returnErrorResponse(response, error, 500);

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
			const { data, error } = await supabase
				.from("trees_watered")
				.select("tree_id");

			returnErrorResponse(response, error, 500);

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

			if (!tree_ids) {
				return response
					.status(400)
					.json({ error: "tree_ids query is required" });
			}
			const trimmed_tree_ids = tree_ids.split(",").map((id) => id.trim());
			const { data, error } = await supabase
				.from("trees")
				.select("*")
				.in("id", trimmed_tree_ids);

			returnErrorResponse(response, error, 500);

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
			const { data, error } = await supabase.rpc("get_watered_and_adopted");

			returnErrorResponse(response, error, 500);

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
			if (limit > 10000) {
				return response.status(400).json({
					error: "limit needs to be smaller than 10000",
				});
			}
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
				.range(offset, offset + limit);

			returnErrorResponse(response, error, 500);

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
			if (!startStr) {
				return response.status(400).json({ error: "start query is required" });
			}
			if (!endStr) {
				return response.status(400).json({ error: "end query is required" });
			}

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

			const { data: count, error } = await supabase.rpc("count_by_age", {
				start_year: start,
				end_year: end,
			});

			returnErrorResponse(response, error, 500);

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
			if (!startStr) {
				return response.status(400).json({ error: "start query is required" });
			}
			if (!endStr) {
				return response.status(400).json({ error: "end query is required" });
			}

			if (Array.isArray(endStr)) {
				return response.status(400).json({ error: "end needs to be a string" });
			}
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

			const { data, error } = await supabase
				.from("trees")
				.select("id")
				.gte("pflanzjahr", start)
				.lte("pflanzjahr", end);

			returnErrorResponse(response, error, 500);

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
			if (!id) {
				return response.status(400).json({ error: "id query is required" });
			}

			const { data, error } = await supabase
				.from("trees_watered")
				.select("id,timestamp,amount,username,tree_id")
				.eq("tree_id", id)
				.order("timestamp", { ascending: false });

			returnErrorResponse(response, error, 500);

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
			if (!uuid) {
				return response.status(400).json({ error: "uuid query is required" });
			}

			const { data, error } = await supabase
				.from("trees_adopted")
				.select("tree_id,uuid")
				.eq("uuid", uuid);

			returnErrorResponse(response, error, 500);

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
			if (!uuid) {
				return response.status(400).json({ error: "uuid query is required" });
			}
			if (!id) {
				return response
					.status(400)
					.json({ error: "tree_id query is required" });
			}

			const { data, error } = await supabase
				.from("trees_adopted")
				.select("uuid,tree_id")
				.eq("uuid", uuid)
				.eq("tree_id", id);

			returnErrorResponse(response, error, 500);

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
			if (!uuid) {
				return response.status(400).json({ error: "uuid query is required" });
			}

			const { data, error } = await supabase
				.from("trees_watered")
				.select("*")
				.eq("uuid", uuid);

			returnErrorResponse(response, error, 500);

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
