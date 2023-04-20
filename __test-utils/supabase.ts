import { createClient } from "@supabase/supabase-js";
import { Database } from "../_types/database";
export const SUPABASE_URL =
	process.env.SUPABASE_URL || "http://localhost:54321";
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
export const SUPABASE_SERVICE_ROLE_KEY =
	process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabaseAnonClient = createClient<Database>(
	SUPABASE_URL,
	SUPABASE_ANON_KEY
);
export const supabaseServiceRoleClient = createClient<Database>(
	SUPABASE_URL,
	SUPABASE_SERVICE_ROLE_KEY
);
