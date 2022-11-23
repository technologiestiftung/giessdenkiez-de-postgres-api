module.exports = {
	extends: "@istanbuljs/nyc-config-typescript",
	all: true,
	"check-coverage": true,
	include: ["api/**/*.ts"],
	exclude: [
		"api/**/*.spec.ts",
		"api/**/*.test.ts",
		"api/_deprecated/**",
		"api/__test-utils/**",
		"api/_types/**",
		"api/_utils/common/**",
	],
	branches: 80,
	lines: 80,
	functions: 80,
	statements: 80,

	watermarks: {
		lines: [80, 95],
		functions: [80, 95],
		branches: [80, 95],
		statements: [80, 95],
	},
};
