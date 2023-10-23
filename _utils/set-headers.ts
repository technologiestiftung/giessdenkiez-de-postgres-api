import { VercelResponse } from "@vercel/node";
import { getEnvs } from "./envs";
const { ACCESS_CONTROL_ALLOW_ORIGIN } = getEnvs();

export default function setHeaders(
	response: VercelResponse,
	method: "GET" | "POST" | "DELETE"
): void {
	response.setHeader("Access-Control-Allow-Credentials", "true");
	response.setHeader("Access-Control-Allow-Origin", ACCESS_CONTROL_ALLOW_ORIGIN);
	response.setHeader("Access-Control-Allow-Methods", `${method}, OPTIONS`);
	response.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With, Authorization, Accept, Content-Type"
	);
}
