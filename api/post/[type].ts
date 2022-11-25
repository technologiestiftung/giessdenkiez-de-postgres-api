const queryTypes = ["adopt", "water"];
import { VercelRequest, VercelResponse } from "@vercel/node";
import setHeaders from "../_utils/set-headers";
import { supabase } from "../_utils/supabase";
import {
	adoptSchema,
	AjvSchema,
	validate,
	waterSchema,
} from "../_utils/validation";
import { Database } from "../_types/database";
import { verifyRequest } from "../_utils/auth/verify";

// api/[name].ts -> /api/lee
// req.query.name -> "lee"

const schemas: Record<string, AjvSchema> = {
	adopt: adoptSchema,
	water: waterSchema,
};

// type TreesAdopted = Database["public"]["Tables"]["trees_adopted"]["Insert"];
type TreesWatered = Database["public"]["Tables"]["trees_watered"]["Insert"];
export default async function (
	request: VercelRequest,
	response: VercelResponse,
) {
	setHeaders(response, "POST");
	if (request.method === "OPTIONS") {
		return response.status(200).end();
	}
	const authorized = await verifyRequest(request);
	if (!authorized) {
		return response.status(401).json({ error: "unauthorized" });
	}
	const { type } = request.query;
	if (Array.isArray(type)) {
		return response.status(400).json({ error: "type needs to be a string" });
	}
	if (!queryTypes.includes(type)) {
		return response.status(400).json({ error: "invalid query type" });
	}
	const [isBodyValid, validationErrors] = validate(request.body, schemas[type]);
	if (!isBodyValid) {
		return response
			.status(400)
			.json({ error: `invalid body: ${JSON.stringify(validationErrors)}` });
	}
	switch (type) {
		default: {
			return response.status(400).json({ error: "invalid query type" });
		}
		// TODO: Test what happens on conflict
		// https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/issues/159

		case "adopt": {
			const { tree_id, uuid } = request.body;
			const { data, error } = await supabase
				.from("trees_adopted")
				.upsert<{ tree_id: string; uuid: string }>(
					{
						tree_id,
						uuid,
					},
					{ onConflict: "user_id" },
				)
				.select();
			if (error) {
				return response.status(500).json({ error });
			}
			return response.status(201).json({ message: "adopted", data });
		}
		case "water": {
			const body = request.body as TreesWatered;
			const { tree_id, username, timestamp, uuid, amount } = body;
			const { data, error } = await supabase
				.from("trees_watered")
				.insert<Database["public"]["Tables"]["trees_watered"]["Insert"]>({
					// TODO: Remove time from db schema trees_watered  it is a legacy value not used anymore
					// https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/issues/160
					time: timestamp!,
					tree_id,
					username,
					timestamp,
					uuid,
					amount,
				})
				.select();
			if (error) {
				return response.status(500).json({ error });
			}
			return response.status(201).json({ message: "watered", data });
		}
	}
}
