/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/*.spec.ts", "**/*.test.ts"],
	testPathIgnorePatterns: [
		"<rootDir>/dist/",
		"<rootDir>/node_modules/",
		"<rootDir>/api/_deprecated/",
	],
};
