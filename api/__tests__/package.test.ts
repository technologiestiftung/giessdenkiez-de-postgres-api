import { getPackage } from "../_utils/package";
import fs from "fs";
// make jest spy on fs.readFileSync

describe("package module", () => {
	// eslint-disable-next-line jest/no-hooks
	afterAll(() => {
		jest.restoreAllMocks();
	});
	test("should", () => {
		const spyFsRead = jest.spyOn(fs, "readFileSync");
		const pkg = getPackage();
		// eslint-disable-next-line jest/prefer-called-with
		expect(spyFsRead).toHaveBeenCalled();
		expect(pkg.name).toBeDefined();
		expect(pkg.version).toBeDefined();
	});
});
