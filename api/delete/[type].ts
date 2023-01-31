import { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyRequest } from "../../_utils/verify";
import setHeaders from "../../_utils/set-headers";
import { supabase } from "../../_utils/supabase";
import { deleteSchemas, validate } from "../../_utils/validation";

export const queryTypes = ["unadopt", "unwater"];
// const schemas: Record<string, AjvSchema> = {
// 	unadopt: unadoptSchema,
// 	unwater: unwaterSchema,
// };
// api/[name].ts -> /api/lee
// req.query.name -> "lee"
export default async function deleteHandler(
	request: VercelRequest,
	response: VercelResponse
) {
	setHeaders(response, "DELETE");
	if (request.method === "OPTIONS") {
		return response.status(200).end();
	}
	const authorized = await verifyRequest(request);
	if (!authorized) {
		return response.status(401).json({ error: "unauthorized" });
	}
	const { type } = request.query;
	if (Array.isArray(type)) {
		return response.status(400).json({ error: "type needs to be a string" });
	}
	if (!queryTypes.includes(type)) {
		return response.status(400).json({ error: "invalid query type" });
	}
	const [isBodyValid, validationErrors] = validate(
		request.body,
		deleteSchemas[type]
	);
	if (!isBodyValid) {
		return response
			.status(400)
			.json({ error: `invalid body: ${JSON.stringify(validationErrors)}` });
	}

	switch (type) {
		default: {
			// this is here to be sure there is no fall through case,
			// but we actually already checked for the type above.
			// So this is actually unreachable
			return response.status(400).json({ error: "invalid query type" });
		}
		case "unadopt": {
			const { tree_id, uuid } = request.body;
			const { error } = await supabase
				.from("trees_adopted")
				.delete()
				.eq("tree_id", tree_id)
				.eq("uuid", uuid);
			if (error) {
				return response.status(500).json({ error });
			}
			return response
				.status(204)
				.json({ message: `unadopted tree ${tree_id}` });
		}
		case "unwater": {
			// FIXME: [GDK-221] API (with supabase) Find out why delete/unwater route does not work

			const { tree_id, uuid, watering_id } = request.body;
			const { error } = await supabase
				.from("trees_watered")
				.delete()
				.eq("tree_id", tree_id)
				.eq("uuid", uuid)
				.eq("id", watering_id);
			if (error) {
				return response.status(500).json({ error });
			}
			return response
				.status(204)
				.json({ message: `unwatered tree ${tree_id} ` });
		}
	}
}
