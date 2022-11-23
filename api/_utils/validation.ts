import Ajv from "ajv";

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

interface AjvSchema {
	type: string;
	properties: {
		[key: string]: unknown;
	};
	required: string[];
	additionalProperties: boolean;
}

export const testSchema: AjvSchema = {
	type: "object",
	properties: {
		foo: { type: "integer" },
		bar: { type: "string" },
	},
	required: ["foo"],
	additionalProperties: false,
};

export const waterSchema: AjvSchema = {
	type: "object",
	properties: {
		uuid: { type: "string" },
		tree_id: { type: "string" },
		username: { type: "string" },
		timestamp: { type: "string" },
		amount: { type: "number" },
	},
	required: ["uuid", "tree_id", "username", "timestamp", "amount"],
	additionalProperties: false,
};

export const adoptSchema: AjvSchema = {
	type: "object",
	properties: {
		uuid: { type: "string" },
		tree_id: { type: "string" },
	},
	required: ["uuid", "tree_id"],
	additionalProperties: false,
};

export { ajv };

export const validate = (body: Record<string, unknown>, schema: AjvSchema) => {
	const validate = ajv.compile(schema);
	const valid = validate(body);

	if (!valid) {
		return false;
	}
	return true;
};
