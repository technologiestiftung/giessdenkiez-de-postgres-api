import { createClient } from "@supabase/supabase-js";
import { Database } from "../_types/database";
import { getEnvs } from "./envs";
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = getEnvs();

export const supabase = createClient<Database>(
	SUPABASE_URL,
	SUPABASE_SERVICE_ROLE_KEY
);
