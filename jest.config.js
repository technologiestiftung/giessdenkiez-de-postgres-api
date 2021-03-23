/* eslint-disable @typescript-eslint/no-var-requires */
const defaultConfig = require("@inpyjamas/scripts/jest");
const utlities = require("@inpyjamas/scripts/dist/utlities");
const path = require("path");

module.exports = defaultConfig;

module.exports = utlities.merge(defaultConfig, {
  testEnvironment: path.join(__dirname, "prisma", "prisma-test-environment.js"),
  // setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  collectCoverageFrom: ["api/**/*.{ts,tsx}", "api/*.{ts,tsx}"],
  // globalSetup: "./jest.setup.js",
  // globalTeardown : "./jest.global-teardown.js",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "dist",
    "deprecated",
    "api/__test-utils/",
  ],
  // TODO: [GDK-70] API: Increase test coverage to at least 75%
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 70,
      lines: 75,
      statements: 75,
    },
  },
});
