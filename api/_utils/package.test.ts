//TODO: [GDK-216] Tests for fs access fail in ESM env with latest TS and Jest
import { getPackage } from "./package";
// import { readFileSync } from "fs";
// const mockfs = { readFileSync };
// const spyFsRead = jest.spyOn(mockfs, "readFileSync");
describe("package module", () => {
	// eslint-disable-next-line jest/no-hooks
	afterAll(() => {
		jest.restoreAllMocks();
	});
	test("should", () => {
		const pkg = getPackage();
		// eslint-disable-next-line jest/prefer-called-with
		// expect(spyFsRead).toHaveBeenCalled();
		expect(pkg.name).toBeDefined();
		expect(pkg.version).toBeDefined();
	});
});
