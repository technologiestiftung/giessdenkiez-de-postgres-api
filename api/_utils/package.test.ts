import { getPackage } from "./package";
import fs from "fs";
const spyFsRead = jest.spyOn(fs, "readFileSync");
describe("package module", () => {
	// eslint-disable-next-line jest/no-hooks
	afterAll(() => {
		jest.restoreAllMocks();
	});
	test("should", () => {
		const pkg = getPackage();
		// eslint-disable-next-line jest/prefer-called-with
		expect(spyFsRead).toHaveBeenCalled();
		expect(pkg.name).toBeDefined();
		expect(pkg.version).toBeDefined();
	});
});
