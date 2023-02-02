import { VercelResponse } from "@vercel/node";

export default function setHeaders(
	response: VercelResponse,
	method: "GET" | "POST" | "DELETE"
): void {
	response.setHeader("Access-Control-Allow-Credentials", "true");
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Methods", `${method}, OPTIONS`);
	response.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With, Authorization, Accept, Content-Type"
	);
}
