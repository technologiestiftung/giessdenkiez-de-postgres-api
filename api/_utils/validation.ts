import Ajv from "ajv";

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

export const schema = {
	type: "object",
	properties: {
		foo: { type: "integer" },
		bar: { type: "string" },
	},
	required: ["foo"],
	additionalProperties: false,
};

export const waterSchema = {
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

export const adoptSchema = {
	type: "object",
	properties: {
		uuid: { type: "string" },
		tree_id: { type: "string" },
	},
	required: ["uuid", "tree_id"],
	additionalProperties: false,
};

export { ajv };

export const validate = (body: any, schema: any) => {
	const validate = ajv.compile(schema);
	const valid = validate(body);

	if (!valid) {
		return false;
	}
	return true;
};
