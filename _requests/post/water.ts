import { User } from "@supabase/supabase-js";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { Database } from "../../_types/database";
import { urlContainsV3 } from "../../_utils/check-if-v3";
import { checkDataError } from "../../_utils/data-error-response";
import { supabase } from "../../_utils/supabase";
type TreesWatered = Database["public"]["Tables"]["trees_watered"]["Insert"];

export default async function handler(
	request: VercelRequest,
	response: VercelResponse,
	user?: User
) {
	const body = request.body as TreesWatered;
	const { tree_id, timestamp, amount } = body;
	let { uuid, username } = request.body;
	if (!request.url) {
		return response.status(500).json({ error: "no url in request" });
	}

	if (urlContainsV3(request.url)) {
		uuid = user?.id || uuid;
		const { data, error } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", uuid);
		checkDataError({
			data,
			error,
			response,
			errorMessage: "no user profile found",
		});

		type UserProfiles = NonNullable<typeof data>;
		username = (data as UserProfiles)[0].username || username;
	}

	const { data, error } = await supabase
		.from("trees_watered")
		.insert({
			// TODO: [GDK-220] Remove time from db schema trees_watered  it is a legacy value not used anymore
			// https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/issues/160
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
