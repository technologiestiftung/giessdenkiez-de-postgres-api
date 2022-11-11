const queryTypes = ["unadopt", "unwater"];

import { VercelRequest, VercelResponse } from "@vercel/node";
import setHeaders from "../_utils/set-headers";
import { supabase } from "../_utils/supabase";

// api/[name].ts -> /api/lee
// req.query.name -> "lee"
export default async function (
	request: VercelRequest,
	response: VercelResponse
) {
	setHeaders(response, "DELETE");
	const { type } = request.query;
	if (Array.isArray(type)) {
		return response.status(400).json({ error: "type needs to be a string" });
	}

	switch (type) {
		default:
			return response.status(400).json({ error: "invalid query type" });
		case "unadopt":
			return response.status(204).json({ message: "unadopted" });
		case "unwater":
			return response.status(204).json({ message: "unwatered" });
	}
}
