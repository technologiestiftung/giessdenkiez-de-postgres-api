import { VercelRequest, VercelResponse } from "@vercel/node";
import setHeaders from "../../_utils/set-headers";
import { postSchemas, validate } from "../../_utils/validation";
import { queryTypes as queryTypesList } from "../../_utils/routes-listing";
import { verifyAuth0Request } from "../../_utils/verify-auth0";
import adoptHandler from "../../_requests/post/adopt";
import waterHandler from "../../_requests/post/water";

const queryTypes = Object.keys(queryTypesList["POST"]);

// api/[name].ts -> /api/lee
// req.query.name -> "lee"

export default async function postHandler(
	request: VercelRequest,
	response: VercelResponse
) {
	setHeaders(response, "POST");
	if (request.method === "OPTIONS") {
		return response.status(200).end();
	}

	// const { data: userData, error } = await verifySupabaseToken(request);
	// if (error) {
	// 	console.error("error from supabase auth", error);
	// 	return response.status(401).json({ error: "unauthorized" });
	// }
	// if (!userData) {
	// 	console.error("no user data from supabase auth");
	// 	return response.status(401).json({ error: "unauthorized" });
	// }
	/**
	 * We will remove auth0 but for now we can auth with both
	 */
	const auth0RequestValid = await verifyAuth0Request(request);
	if (!auth0RequestValid) {
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
		postSchemas[type]
	);
	if (!isBodyValid) {
		return response
			.status(400)
			.json({ error: `invalid body: ${JSON.stringify(validationErrors)}` });
	}
	switch (type) {
		default: {
			// Since we safegaurd agains invalid types,
			// we can safely assume that the type is valid.
			// Should not be a fall through case.
			return response.status(400).json({ error: "invalid query type" });
		}
		// https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/issues/159

		case "adopt": {
			return await adoptHandler(request, response);
		}
		case "water": {
			return await waterHandler(request, response);
		}
	}
}
