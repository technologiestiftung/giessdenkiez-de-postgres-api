import { VercelRequest, VercelResponse } from "@vercel/node";
import { send } from "micro";
import { setupResponseData } from "../setup-response";
import { verifyAuth0Token, options } from "./verify-token";
import { handleVerifiedRequest } from "./handle-verified-requests";

export async function verifyRequest(
	request: VercelRequest,
	response: VercelResponse,
): Promise<void> {
	let statusCode = 200;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	try {
		if (request.method === "OPTIONS") {
			return send(response, statusCode);
		}
		if (!request.headers?.authorization) {
			statusCode = 401;
			return send(
				response,
				statusCode,
				setupResponseData({ message: "sorry not authorized :-(" }),
			);
		}
		const token = request.headers.authorization.split(" ")[1];
		const decoded = await verifyAuth0Token(token, options);

		if (decoded === undefined) {
			statusCode = 401;
			return send(
				response,
				statusCode,
				setupResponseData({ message: "sorry not authorized :-(" }),
			);
		} else {
			// token should be valid now
			await handleVerifiedRequest(request, response);
		}
	} catch (error: unknown) {
		if (error instanceof Error) {
			statusCode = 500;
			let data = {};
			if (process.env.NODE_ENV === "development") {
				console.error(error);
				data = { ...setupResponseData({ error: error.message }) };
			}
			if (process.env.NODE_ENV === "test") {
				data = {};
			}
			if (process.env.NODE_ENV === "production") {
				data = { error: error.message };
			}
			return send(response, statusCode, data);
		} else {
			return send(response, 500, "something went wrong");
		}
	}
}
