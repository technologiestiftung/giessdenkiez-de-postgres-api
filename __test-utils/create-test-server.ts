// Based on https://github.com/willianantunes/nextjs-playground/blob/master/__tests__/integration/pages/api/health.spec.test.js
// And https://github.com/Xunnamius/next-test-api-route-handler/blob/main/src/index.ts#L94
// import dns from "dns";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { apiResolver } from "next/dist/server/api-utils/node";
import http, { Server } from "http";
import listen from "test-listen";

/**
 *
 */
export async function createTestServer(
	query: Record<string, string>,
	handler: (
		request: VercelRequest,
		response: VercelResponse
	) => Promise<VercelResponse>
): Promise<{
	server: Server;
	url: string;
}> {
	const server = http.createServer((req, res) => {
		return apiResolver(req, res, query, handler, undefined as any, false);
	});
	const url = await listen(server);
	const urlWithParams = `${url}?${new URLSearchParams(query)}`;
	return { server, url: urlWithParams };
}
