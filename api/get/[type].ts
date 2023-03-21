import { VercelRequest, VercelResponse } from "@vercel/node";
import setHeaders from "../../_utils/set-headers";
import { queryTypes as queryTypesList } from "../../_utils/routes-listing";
import { getSchemas, paramsToObject, validate } from "../../_utils/validation";

import byidHandler from "./_requests/byid";
import treesbyidsHandler from "./_requests/treesbyids";
import wateredandadoptedHandler from "./_requests/wateredandadopted";
import lastwateredHandler from "./_requests/lastwatered";
import adoptedHandler from "./_requests/adopted";
import istreeadoptedHandler from "./_requests/istreeadopted";
import wateredbyuserHandler from "./_requests/wateredbyuser";

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
		case "treesbyids": {
			return await treesbyidsHandler(request, response);
		}
		case "wateredandadopted": {
			return await wateredandadoptedHandler(request, response);
		}
		case "lastwatered": {
			return await lastwateredHandler(request, response);
		}
		// All requests below this line are only available for authenticated users
		// --------------------------------------------------------------------
		case "adopted": {
			return await adoptedHandler(request, response);
		}
		case "istreeadopted": {
			return await istreeadoptedHandler(request, response);
		}

		case "wateredbyuser": {
			return await wateredbyuserHandler(request, response);
		}
	}
}
