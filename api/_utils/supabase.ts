import { createClient } from "@supabase/supabase-js";
import { Database } from "../_types/database";
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!(url && key)) {
	throw new Error("Missing environment variables for Supabase");
}

export const supabase = createClient<Database>(url, key);
