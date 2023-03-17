import { listRoutes } from "../_utils/routes-listing";
import { paramsToObject, validate } from "../_utils/validation";
const getRoutesList = listRoutes("GET");
const postRoutesList = listRoutes("POST");
const deleteRoutesList = listRoutes("DELETE");
describe("route listing", () => {
	test("should validate urlSearchParams", () => {
		const params = paramsToObject("uuid=1234&limit=10&offset=0");
		const [valid, _validationErrors] = validate(
			params,
			getRoutesList.routes.lastwatered.schema
		);
		// const validate = ajv.compile(getRoutesList.routes.adopted.schema);
		// const valid = validate(params);

		expect(valid).toBe(false);
	});

	test("should list all DELETE routes", () => {
		expect(deleteRoutesList).toMatchInlineSnapshot(`
		{
		  "method": "DELETE",
		  "routes": {
		    "unadopt": {
		      "schema": {
		        "additionalProperties": false,
		        "properties": {
		          "queryType": {
		            "type": "string",
		          },
		          "tree_id": {
		            "type": "string",
		          },
		          "uuid": {
		            "type": "string",
		          },
		        },
		        "required": [
		          "uuid",
		          "tree_id",
		        ],
		        "type": "object",
		      },
		      "url": "delete/unadopt",
		    },
		    "unwater": {
		      "schema": {
		        "additionalProperties": false,
		        "properties": {
		          "queryType": {
		            "type": "string",
		          },
		          "tree_id": {
		            "type": "string",
		          },
		          "uuid": {
		            "type": "string",
		          },
		          "watering_id": {
		            "type": "number",
		          },
		        },
		        "required": [
		          "uuid",
		          "tree_id",
		          "watering_id",
		        ],
		        "type": "object",
		      },
		      "url": "delete/unwater",
		    },
		  },
		}
	`);
	});
	test("should list all POST routes", () => {
		expect(postRoutesList).toMatchInlineSnapshot(`
		{
		  "method": "POST",
		  "routes": {
		    "adopt": {
		      "schema": {
		        "additionalProperties": false,
		        "properties": {
		          "queryType": {
		            "type": "string",
		          },
		          "tree_id": {
		            "type": "string",
		          },
		          "uuid": {
		            "type": "string",
		          },
		        },
		        "required": [
		          "uuid",
		          "tree_id",
		        ],
		        "type": "object",
		      },
		      "url": "post/adopt",
		    },
		    "water": {
		      "schema": {
		        "additionalProperties": false,
		        "properties": {
		          "amount": {
		            "type": "number",
		          },
		          "queryType": {
		            "type": "string",
		          },
		          "timestamp": {
		            "type": "string",
		          },
		          "tree_id": {
		            "type": "string",
		          },
		          "username": {
		            "type": "string",
		          },
		          "uuid": {
		            "type": "string",
		          },
		        },
		        "required": [
		          "uuid",
		          "tree_id",
		          "username",
		          "timestamp",
		          "amount",
		        ],
		        "type": "object",
		      },
		      "url": "post/water",
		    },
		  },
		}
	`);
	});

	test("should list all the GET routes", async () => {
		expect(getRoutesList).toMatchInlineSnapshot(`
		{
		  "method": "GET",
		  "routes": {
		    "adopted": {
		      "schema": {
		        "additionalProperties": false,
		        "properties": {
		          "limit": {
		            "type": "string",
		          },
		          "offset": {
		            "type": "string",
		          },
		          "type": {
		            "description": "The type property is atomaticaly added by dynamic vercel api routes. You should not add it yourself",
		            "type": "string",
		          },
		          "uuid": {
		            "type": "string",
		          },
		        },
		        "required": [
		          "uuid",
		        ],
		        "type": "object",
		      },
		      "url": "get/adopted",
		    },
		    "byid": {
		      "schema": {
		        "additionalProperties": false,
		        "properties": {
		          "id": {
		            "type": "string",
		          },
		          "type": {
		            "description": "The type property is atomaticaly added by dynamic vercel api routes. You should not add it yourself",
		            "type": "string",
		          },
		        },
		        "required": [
		          "id",
		        ],
		        "type": "object",
		      },
		      "url": "get/byid",
		    },
		    "istreeadopted": {
		      "schema": {
		        "additionalProperties": false,
		        "properties": {
		          "id": {
		            "type": "string",
		          },
		          "type": {
		            "description": "The type property is atomaticaly added by dynamic vercel api routes. You should not add it yourself",
		            "type": "string",
		          },
		          "uuid": {
		            "type": "string",
		          },
		        },
		        "required": [
		          "uuid",
		          "id",
		        ],
		        "type": "object",
		      },
		      "url": "get/istreeadopted",
		    },
		    "lastwatered": {
		      "schema": {
		        "additionalProperties": false,
		        "properties": {
		          "id": {
		            "type": "string",
		          },
		          "limit": {
		            "type": "string",
		          },
		          "offset": {
		            "type": "string",
		          },
		          "type": {
		            "description": "The type property is atomaticaly added by dynamic vercel api routes. You should not add it yourself",
		            "type": "string",
		          },
		        },
		        "required": [
		          "id",
		        ],
		        "type": "object",
		      },
		      "url": "get/lastwatered",
		    },
		    "treesbyids": {
		      "schema": {
		        "additionalProperties": false,
		        "properties": {
		          "limit": {
		            "type": "string",
		          },
		          "offset": {
		            "type": "string",
		          },
		          "tree_ids": {
		            "type": "string",
		          },
		          "type": {
		            "description": "The type property is atomaticaly added by dynamic vercel api routes. You should not add it yourself",
		            "type": "string",
		          },
		        },
		        "required": [
		          "tree_ids",
		        ],
		        "type": "object",
		      },
		      "url": "get/treesbyids",
		    },
		    "wateredandadopted": {
		      "schema": {
		        "additionalProperties": false,
		        "properties": {
		          "limit": {
		            "type": "string",
		          },
		          "offset": {
		            "type": "string",
		          },
		          "type": {
		            "description": "The type property is atomaticaly added by dynamic vercel api routes. You should not add it yourself",
		            "type": "string",
		          },
		        },
		        "required": [],
		        "type": "object",
		      },
		      "url": "get/wateredandadopted",
		    },
		    "wateredbyuser": {
		      "schema": {
		        "additionalProperties": false,
		        "properties": {
		          "type": {
		            "description": "The type property is atomaticaly added by dynamic vercel api routes. You should not add it yourself",
		            "type": "string",
		          },
		          "uuid": {
		            "type": "string",
		          },
		        },
		        "required": [
		          "uuid",
		        ],
		        "type": "object",
		      },
		      "url": "get/wateredbyuser",
		    },
		  },
		}
	`);
	});
});
