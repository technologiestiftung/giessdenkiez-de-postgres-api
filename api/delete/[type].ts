import { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyAuth0Request } from "../../_utils/verify-auth0";
import setHeaders from "../../_utils/set-headers";
import { deleteSchemas, validate } from "../../_utils/validation";

import unadoptHandler from "../../_requests/delete/unadopt";
import unwaterHandler from "../../_requests/delete/unwater";
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
	const authorized = await verifyAuth0Request(request);
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
			return await unadoptHandler(request, response);
		}
		case "unwater": {
			return await unwaterHandler(request, response);
		}
	}
}
