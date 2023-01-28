/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	// preset: "ts-jest/presets/default-esm", // or other ESM presets
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},
	transform: {
		// '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
		// '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
		"^.+\\.tsx?$": [
			"ts-jest",
			{
				isolatedModules: true,
				tsconfig: "tsconfig.json",
				useESM: true,
			},
		],
	},
	modulePaths: ["<rootDir>"],
	extensionsToTreatAsEsm: [".ts"],
	testEnvironment: "node",
	testMatch: ["**/*.spec.ts", "**/*.test.ts"],
	collectCoverage: true,
	collectCoverageFrom: ["api/**/*.ts", "_utils/**/*.ts"],
	// setupFiles: ["./jest.env.cjs"],
	setupFilesAfterEnv: ["./jest.setup.cjs"],
	coverageThreshold: {
		global: {
			branches: 70,
			functions: 75,
			lines: 75,
			statements: 75,
		},
	},
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
