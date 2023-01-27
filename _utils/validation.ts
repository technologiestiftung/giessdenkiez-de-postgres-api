import Ajv from "ajv";

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

export interface AjvSchema {
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
		queryType: { type: "string" },
	},
	required: ["uuid", "tree_id", "username", "timestamp", "amount"],
	additionalProperties: false,
};

export const adoptSchema: AjvSchema = {
	type: "object",
	properties: {
		uuid: { type: "string" },
		tree_id: { type: "string" },
		queryType: { type: "string" },
	},
	required: ["uuid", "tree_id"],
	additionalProperties: false,
};

export const unadoptSchema: AjvSchema = {
	type: "object",
	properties: {
		uuid: { type: "string" },
		tree_id: { type: "string" },
		queryType: { type: "string" },
	},
	required: ["uuid", "tree_id"],
	additionalProperties: false,
};

export const unwaterSchema: AjvSchema = {
	type: "object",
	properties: {
		watering_id: { type: "number" },
		uuid: { type: "string" },
		tree_id: { type: "string" },
		queryType: { type: "string" },
	},
	required: ["uuid", "tree_id", "watering_id"],
	additionalProperties: false,
};

export { ajv };

export const validate = (body: Record<string, unknown>, schema: AjvSchema) => {
	const validate = ajv.compile(schema);
	const valid = validate(body);

	if (!valid) {
		return [false, validate.errors];
	}
	return [true, null];
};
