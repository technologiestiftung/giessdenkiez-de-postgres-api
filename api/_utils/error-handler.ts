import { setupResponseData } from "./setup-response";
import { VercelResponse } from "@vercel/node";

/**
 * @deprecated
 */

export async function errorHandler(opts: {
	response: VercelResponse;
	error: Error;
	statusCode: number;
}) {
	const { error, statusCode, response } = opts;
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
	return response.status(statusCode).json(data);
}
