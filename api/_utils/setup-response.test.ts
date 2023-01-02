import * as pkg from "./package";
jest.mock("./envs", () => {
	return {
		getEnvs: () => {
			return {
				jwksUri: "",
				audience: "",
				issuer: "",
				audienceFrontend: "",
				auth0ClientIdManagementApi: "xyz",
				auth0ClientSecretManagementApi: "xyz",
				auth0ManagementApiAudience: "xyz",
				auth0TokenApiUrlManagementApi: "http://api.xyz",
				auth0ManagementApiUrl: "http://api.abc",
			};
		},
	};
});
jest.mock("./package", () => {
	return {
		getPackage: jest.fn().mockImplementation(() => {
			return {
				name: "foo",
				version: "0.1.0",
				bugs: { url: "https://example.com" },
				homepage: "https://example.com",
			};
		}),
	};
});
describe("setup-response", () => {
	// eslint-disable-next-line jest/no-hooks
	afterAll(() => {
		jest.restoreAllMocks();
	});
	test("should call package.ts", () => {
		// eslint-disable-next-line jest/valid-expect-in-promise
		import("./setup-response")
			.then((module) => {
				const overrides = { main: "index.js" };
				const res = module.setupResponseData(overrides);
				// eslint-disable-next-line jest/prefer-called-with
				expect(pkg.getPackage).toHaveBeenCalled();
				expect(res.main).toBe("index.js");
			})
			.catch((err) => {
				throw err;
			});
	});
});
