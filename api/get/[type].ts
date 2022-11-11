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

import { VercelRequest, VercelResponse } from "@vercel/node";
import setHeaders from "../_utils/set-headers";
import { supabase } from "../_utils/supabase";

// api/[name].ts -> /api/lee
// req.query.name -> "lee"
export default async function (
	request: VercelRequest,
	response: VercelResponse
) {
	setHeaders(response, "GET");
	const { type } = request.query;
	if (Array.isArray(type)) {
		return response.status(400).json({ error: "type needs to be a string" });
	}

	switch (type) {
		default:
			return response.status(400).json({ error: "invalid query type" });
		case "byid":
			return response.status(200).json({ message: "byid" });
		case "treesbyids":
			return response.status(200).json({ message: "treesbyids" });
		case "adopted":
			return response.status(200).json({ message: "adopted" });
		case "countbyage":
			return response.status(200).json({ message: "countbyage" });
		case "watered":
			return response.status(200).json({ message: "watered" });
		case "all":
			return response.status(200).json({ message: "all" });
		case "istreeadopted":
			return response.status(200).json({ message: "istreeadopted" });
		case "wateredandadopted":
			return response.status(200).json({ message: "wateredandadopted" });
		case "byage":
			return response.status(200).json({ message: "byage" });
		case "lastwatered":
			return response.status(200).json({ message: "lastwatered" });
		case "wateredbyuser":
			return response.status(200).json({ message: "wateredbyuser" });
	}
}
