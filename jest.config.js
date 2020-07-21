/* eslint-disable @typescript-eslint/no-var-requires */
const defaultConfig = require("@inpyjamas/scripts/jest");
defaultConfig.collectCoverageFrom = ["api/**/*.{ts,tsx}"];
defaultConfig.globalSetup = "./test/jest.global-setup.js";
defaultConfig.globalTeardown = "./test/jest.global-teardown.js";
defaultConfig.coveragePathIgnorePatterns = [
  "/node_modules/",
  "dist",
  "deprecated",
];
module.exports = defaultConfig;
