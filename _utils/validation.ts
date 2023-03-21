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

// export const testSchema: AjvSchema = {
// 	type: "object",
// 	properties: {
// 		foo: { type: "integer" },
// 		bar: { type: "string" },
// 	},
// 	required: ["foo"],
// 	additionalProperties: false,
// };

/**
 * This is the automatically added property by vercel.
 */
const type = {
	type: "string",
	description:
		"The type property is atomaticaly added by dynamic vercel api routes. You should not add it yourself",
};
export const byidSchema: AjvSchema = {
	type: "object",
	properties: {
		type,
		id: { type: "string" },
	},
	required: ["id"],
	additionalProperties: false,
};

export const treesbyidsSchema: AjvSchema = {
	type: "object",
	properties: {
		type,
		tree_ids: { type: "string" },
		limit: { type: "string" },
		offset: { type: "string" },
	},
	required: ["tree_ids"],
	additionalProperties: false,
};

export const wateredandadoptedSchemata: AjvSchema = {
	type: "object",
	properties: {
		type,
		limit: { type: "string" },
		offset: { type: "string" },
	},
	required: [],
	additionalProperties: false,
};

export const allSchema: AjvSchema = {
	type: "object",
	properties: {
		type,
		limit: { type: "string" },
		offset: { type: "string" },
	},
	required: ["limit", "offset"],
	additionalProperties: false,
};

export const countbyageSchema: AjvSchema = {
	type: "object",
	properties: {
		type,
		start: { type: "string" },
		end: { type: "string" },
	},
	required: ["start", "end"],
	additionalProperties: false,
};

export const byageSchema: AjvSchema = {
	type: "object",
	properties: {
		type,
		start: { type: "string" },
		end: { type: "string" },
		limit: { type: "string" },
		offset: { type: "string" },
	},
	required: ["start", "end"],
	additionalProperties: false,
};

export const lastwateredSchema: AjvSchema = {
	type: "object",
	properties: {
		type,
		id: { type: "string" },
		limit: { type: "string" },
		offset: { type: "string" },
	},
	required: ["id"],
	additionalProperties: false,
};

export const adoptedSchema: AjvSchema = {
	type: "object",
	properties: {
		type,
		uuid: { type: "string" },
		limit: { type: "string" },
		offset: { type: "string" },
	},
	required: ["uuid"],
	additionalProperties: false,
};

export const istreeadoptedSchema: AjvSchema = {
	type: "object",
	properties: {
		type,
		uuid: { type: "string" },
		id: { type: "string" },
	},
	required: ["uuid", "id"],
	additionalProperties: false,
};

export const wateredbyuserSchema: AjvSchema = {
	type: "object",
	properties: {
		type,
		uuid: { type: "string" },
	},
	required: ["uuid"],
	additionalProperties: false,
};

export const getSchemas: Record<string, AjvSchema> = {
	byid: byidSchema,
	treesbyids: treesbyidsSchema,
	wateredandadopted: wateredandadoptedSchemata,
	all: allSchema,
	countbyage: countbyageSchema,
	byage: byageSchema,
	lastwatered: lastwateredSchema,
	adopted: adoptedSchema,
	istreeadopted: istreeadoptedSchema,
	wateredbyuser: wateredbyuserSchema,
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

export const postSchemas: Record<string, AjvSchema> = {
	adopt: adoptSchema,
	water: waterSchema,
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

export const deleteSchemas: Record<string, AjvSchema> = {
	unadopt: unadoptSchema,
	unwater: unwaterSchema,
};
export function validate(body: Record<string, unknown>, schema: AjvSchema) {
	const validate = ajv.compile(schema);
	const valid = validate(body);

	if (!valid) {
		return [false, validate.errors];
	}
	return [true, null];
}

export function paramsToObject(url: string) {
	const urlParams = new URLSearchParams(url);
	return Object.fromEntries(urlParams); // {abc: "foo", def: "[asf]", xyz: "5"}
}

export { ajv };
