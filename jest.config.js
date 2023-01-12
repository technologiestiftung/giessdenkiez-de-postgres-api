module.exports = {
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	preset: "ts-jest",
	testEnvironment: "node",
	collectCoverage: true,
	coverageReporters: ["lcov", "text"],
	collectCoverageFrom: ["api/**/*.{ts,tsx}", "api/*.{ts,tsx}"],
	testMatch: ["<rootDir>/**/?(*.)+(test).ts?(x)"],
	testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist"],
	maxWorkers: 2,
	coveragePathIgnorePatterns: [
		"/node_modules/",
		"dist",
		"deprecated",
		"api/__test-utils/",
	],
	coverageThreshold: {
		global: {
			branches: 50,
			functions: 70,
			lines: 75,
			statements: 75,
		},
	},
};
