import { VercelRequest, VercelResponse } from "@vercel/node";
import setHeaders from "../../_utils/set-headers";
import { setupResponseData } from "../../_utils/setup-response";
import { routes } from "../../_utils/routes-listing";

export default async function handler(
	_request: VercelRequest,
	response: VercelResponse
) {
	setHeaders(response, "GET");
	try {
		return response
			.status(200)
			.json(setupResponseData({ message: "its working", routes }));
	} catch (error) {
		return response
			.status(500)
			.json(setupResponseData({ error: "its not working", routes }));
	}
}
