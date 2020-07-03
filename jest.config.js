/* eslint-disable @typescript-eslint/no-var-requires */
const defaultConfig = require("@inpyjamas/scripts/jest");
defaultConfig.collectCoverageFrom = ["api/**/*.{ts,tsx}"];
defaultConfig.coveragePathIgnorePatterns = [
  "/node_modules/",
  "dist",
  "deprecated",
];
module.exports = defaultConfig;
