/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/*.spec.ts", "**/*.test.ts"],
	collectCoverage: true,
	collectCoverageFrom: ["api/**/*.ts"],
	coveragePathIgnorePatterns: [
		"<rootDir>/dist/",
		"<rootDir>/node_modules/",
		"<rootDir>/api/_deprecated/",
		"<rootDir>/api/__test-utils",
		"<rootDir>/api/__tests__",
		"<rootDir>/api/_types",
		"<rootDir>/api/.*\\.d\\.ts$",
		"<rootDir>/api/.*\\.spec\\.ts$",
		"<rootDir>/api/.*\\.test\\.ts$",
		"<rootDir>/api/.*\\.test\\.d\\.ts$",
		"<rootDir>/api/.*\\.spec\\.d\\.ts$",
	],
	testPathIgnorePatterns: [
		"<rootDir>/dist/",
		"<rootDir>/node_modules/",
		"<rootDir>/api/_deprecated/",
	],
};
