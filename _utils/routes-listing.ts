import {
	adoptedSchema,
	adoptSchema,
	AjvSchema,
	byidSchema,
	istreeadoptedSchema,
	lastwateredSchema,
	treesbyidsSchema,
	unadoptSchema,
	unwaterSchema,
	wateredandadoptedSchemata,
	wateredbyuserSchema,
	waterSchema,
} from "./validation";

export const queryTypes: Record<string, Record<string, AjvSchema>> = {
	GET: {
		byid: byidSchema,
		treesbyids: treesbyidsSchema,
		adopted: adoptedSchema,
		istreeadopted: istreeadoptedSchema,
		wateredandadopted: wateredandadoptedSchemata,
		lastwatered: lastwateredSchema,
		wateredbyuser: wateredbyuserSchema,
	},
	POST: { adopt: adoptSchema, water: waterSchema },
	DELETE: { unadopt: unadoptSchema, unwater: unwaterSchema },
};

export type Methods = "GET" | "POST" | "DELETE";

function accumulator(method: Methods) {
	const obj: Record<string, { url: string; schema: AjvSchema }> = {};
	Object.keys(queryTypes[method]).forEach((type) => {
		obj[type] = {
			url: `${method.toLowerCase()}/${type}`,
			schema: queryTypes[method][type],
		};
		return obj;
	});
	return {
		method,
		routes: obj,
	};
}

export function listRoutes(method: Methods) {
	switch (method) {
		case "GET":
		case "POST":
		case "DELETE": {
			return accumulator(method);
		}
		default: {
			throw new Error("Invalid method");
		}
	}
}

export const routes = [
	listRoutes("GET"),
	listRoutes("POST"),
	listRoutes("DELETE"),
];
