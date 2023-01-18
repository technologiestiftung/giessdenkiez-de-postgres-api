/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": [
      'ts-jest', {
        tsconfig: 'tsconfig.json',
        isolatedModules: false
      },
    ]
  },
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts", "**/*.test.ts"],
  collectCoverage: true,
  collectCoverageFrom: ["api/**/*.ts"],
  // setupFiles: ["./jest.env.cjs"],
  setupFilesAfterEnv: ["./jest.setup.cjs"],
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
