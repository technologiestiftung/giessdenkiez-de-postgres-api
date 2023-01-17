module.exports = {
	env: {
		es2021: true,
		node: true,
		"jest/globals": true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:jest/recommended",
		"prettier",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: ["@typescript-eslint", "jest"],
	rules: {
		"@typescript-eslint/no-unused-vars": [
			"error",
			{ varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
		],
	},
};
