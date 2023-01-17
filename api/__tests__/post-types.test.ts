// Based on https://github.com/willianantunes/nextjs-playground/blob/master/__tests__/integration/pages/api/health.spec.test.js
// And https://github.com/Xunnamius/next-test-api-route-handler/blob/main/src/index.ts#L94
// import dns from "dns";
// import http, { Server } from "http";
// import fetch from "cross-fetch";
// import listen from "test-listen";
// import { apiResolver } from "next/dist/server/api-utils/node";
// import handler from "./[type]";

describe("posting data", () => {
	// let server: Server;
	// let url: string;

	// beforeAll(async () => {
	// 	server = http.createServer((req, res) =>
	// 		apiResolver(req, res, undefined, handler, undefined as any, false)
	// 	);
	// 	url = await listen(server);
	// });

	// afterAll(async () => {
	// 	server.close();
	// });

	// test("Should return 200 informing internet status if OK", async () => {
	// 	// dns.promises.lookup.mockReset();
	// 	console.log("url", url);
	// 	const response = await fetch(`${url}/foo`);
	// 	const jsonResult = await response.json();
	// 	console.log(jsonResult);

	// 	expect(response.status).toBe(201);
	// 	expect(jsonResult).toMatchObject({
	// 		internetAvailable: true,
	// 	});
	// });
	test.todo("Add more snapshot tests for POST routes with seeded resultshandl");
});
