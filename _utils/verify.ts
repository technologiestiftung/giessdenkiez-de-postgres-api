import { VercelRequest } from "@vercel/node";
import { options, verifyAuth0Token } from "./verify-token";

export async function verifyRequest(request: VercelRequest) {
	const { authorization } = request.headers;
	if (!authorization) {
		return false;
	}
	const token = authorization.split(" ")[1];
	try {
		const decoded = await verifyAuth0Token(token, options);
		if (decoded === undefined) {
			return false;
		}
		return true;
	} catch (error) {
		return false;
	}
}
