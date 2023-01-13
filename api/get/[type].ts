import { VercelRequest, VercelResponse } from "@vercel/node";
import setHeaders from "../_utils/set-headers";
import { setupResponseData } from "../_utils/setup-response";
import { supabase } from "../_utils/supabase";
import type { Point } from "geojson";
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

// api/[name].ts -> /api/lee
// req.query.name -> "lee"
export default async function (
	request: VercelRequest,
	response: VercelResponse
) {
	setHeaders(response, "GET");
	if (request.method === "OPTIONS") {
		return response.status(200).end();
	}
	const { type } = request.query;
	if (Array.isArray(type)) {
		return response.status(400).json({ error: "type needs to be a string" });
	}
	if (!queryTypes.includes(type)) {
		return response.status(404).json({ error: `invalid route ${type}` });
	}

	switch (type) {
		default:
			return response.status(400).json({ error: "invalid query type" });
		case "byid": {
			const { id } = request.query;
			if (Array.isArray(id)) {
				return response.status(400).json({ error: "id needs to be a string" });
			}
			if (!id) {
				return response.status(400).json({ error: "id query is required" });
			}
			const { data: trees, error } = await supabase
				.from("trees")
				.select("*")
				.eq("id", id);
			if (error) {
				return response.status(500).json({ error });
			}
			if (!trees) {
				return response.status(404).json({ error: "tree not found" });
			}
			const data = setupResponseData({ url: request.url, data: trees, error });
			return response.status(200).json(data);
		}
		case "watered": {
			const { data: trees_watered, error } = await supabase
				.from("trees_watered")
				.select("tree_id");
			if (error) {
				return response.status(500).json({ error });
			}
			if (!trees_watered) {
				return response.status(500).json({ error: "trees_watered not found" });
			}
			const data = setupResponseData({
				url: request.url,
				data: trees_watered,
				error,
			});
			return response.status(200).json(data);
		}
		case "treesbyids": {
			const { tree_ids } = request.query;
			if (Array.isArray(tree_ids)) {
				return response.status(400).json({
					error: "ids needs to be a a comma separated list of tree_ids",
				});
			}
			if (!tree_ids) {
				return response.status(400).json({ error: "ids query is required" });
			}
			const trimmed_tree_ids = tree_ids.split(",").map((id) => id.trim());
			const { data: trees, error } = await supabase
				.from("trees")
				.select("*")
				.in("id", trimmed_tree_ids);
			if (error) {
				return response.status(500).json({ error });
			}
			if (!trees) {
				return response.status(500).json({ error: "trees not found" });
			}

			const data = setupResponseData({ url: request.url, data: trees, error });
			return response.status(200).json(data);
		}
		case "wateredandadopted": {
			const { data: trees_watered_and_adopted, error } = await supabase.rpc(
				"get_watered_and_adopted"
			);
			if (error) {
				return response.status(500).json({ error });
			}
			if (!trees_watered_and_adopted) {
				return response.status(500).json({
					error: "function trees_watered_and_adopted not found",
				});
			}
			const data = setupResponseData({
				url: request.url,
				data: trees_watered_and_adopted,
				error,
			});
			return response.status(200).json(data);
		}
		case "all": {
			let { limit: limit_str, offset: offset_str } = request.query;
			if (Array.isArray(limit_str)) {
				return response
					.status(400)
					.json({ error: "limit needs to be a string" });
			}
			if (Array.isArray(offset_str)) {
				return response
					.status(400)
					.json({ error: "offset needs to be a string" });
			}
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
			const { data: trees, error } = await supabase
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
			if (error) {
				return response.status(500).json({ error });
			}
			if (!trees) {
				return response.status(500).json({ error: "trees not found" });
			}
			// to match the old structure we need to transform the data a little
			// FIXME: [GDK-217] API (with supabase): GET "all" should work with result that is returned without transforming the data into the current structure
			const watered = trees.map((tree) => {
				return [
					tree.id,
					tree.geom.coordinates[0] ? tree.geom.coordinates[0] : 0,
					tree.geom.coordinates[1] ? tree.geom.coordinates[1] : 0,
					tree.radolan_sum ? tree.radolan_sum : 0,
				];
			});

			const data = setupResponseData({
				url: request.url,
				data: watered,
				error,
			});
			return response.status(200).json(data);
		}
		case "countbyage":
			return response.status(200).json({ message: "countbyage" });
		case "adopted":
			return response.status(200).json({ message: "adopted" });
		case "istreeadopted":
			return response.status(200).json({ message: "istreeadopted" });
		case "byage":
			return response.status(200).json({ message: "byage" });
		case "lastwatered":
			return response.status(200).json({ message: "lastwatered" });
		case "wateredbyuser":
			return response.status(200).json({ message: "wateredbyuser" });
	}
}
