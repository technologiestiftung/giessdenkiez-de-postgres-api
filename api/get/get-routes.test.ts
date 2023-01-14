import fetch from "cross-fetch";
import handler from "./[type]";
import { createTestServer } from "../__test-utils/create-test-server";

describe("GET route all", () => {
	// let server: Server;
	// let url: string;

	// beforeAll(async () => {
	// 	server = http.createServer((req, res) => {
	// 		return apiResolver(
	// 			req,
	// 			res,
	// 			{ type: "all" },
	// 			handler,
	// 			undefined as any,
	// 			false
	// 		);
	// 	});
	// 	url = await listen(server);
	// });

	// afterAll(async () => {
	// 	server.close();
	// });

	test("Should return 200 informing internet status if OK", async () => {
		const { server, url } = await createTestServer(
			{ type: "all", limit: "2" },
			handler
		);
		// const query = { type: "all" };
		// dns.promises.lookup.mockReset();
		const response = await fetch(`${url}`);
		server.close();
		// const jsonResult = await response.json();
		expect(response.status).toBe(200);
	});
});
