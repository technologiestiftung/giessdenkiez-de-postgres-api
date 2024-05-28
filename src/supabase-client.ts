import { createClient } from "@supabase/supabase-js";
import { Database } from "./database";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAnonClient = createClient<Database>(
	supabaseUrl,
	supabaseAnonKey
);

export const supabaseServiceRoleClient = createClient<Database>(
	supabaseUrl,
	supabaseServiceRoleKey
);
