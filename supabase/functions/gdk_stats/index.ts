import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("URL");
const SUPABASE_ANON_KEY = Deno.env.get("ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY");
const PUMPS_URL =
	"https://ieokxbqvqedpcyvwmrsb.supabase.co/storage/v1/object/public/data_assets/pumps.geojson";

interface TreeSpecies {
	speciesName: string;
	percentage: number;
}

interface Monthly {
	month: string;
	value: string;
}

interface GdkStats {
	numTrees: number;
	numPumps: number;
	numActiveUsers: number;
	numWateringsThisYear: number;
	averageNumWateringsPerMonth: Monthly[]; // Last 12 months
	averageAmountPerWateringsPerMonth: Monthly[]; // Last 12 months
	numTreeAdoptions: number;
	mostFrequentTreeSpecies: TreeSpecies[];
}

const handler = async (_request: Request): Promise<Response> => {
	if (_request.method === "OPTIONS") {
		return new Response(null, { headers: corsHeaders, status: 204 });
	}

	const supabaseServiceRoleClient = createClient(
		SUPABASE_URL,
		SUPABASE_SERVICE_ROLE_KEY
	);

	// As tree count barely changes, we can hardcode it, would be too expensive to fetch it every time
	// const { count: treesCount } = await supabaseServiceRoleClient
	// 	.from("trees")
	// 	.select("*", { count: "exact", head: true });
	const treesCount = 885825;

	const { count: usersCount } = await supabaseServiceRoleClient
		.from("profiles")
		.select("*", { count: "exact", head: true });

	const beginningOfYear = new Date(`${new Date().getFullYear()}-01-01`);
	const { count: wateringsCount } = await supabaseServiceRoleClient
		.from("trees_watered")
		.select("*", { count: "exact", head: true })
		.gt("timestamp", beginningOfYear.toISOString());

	const { count: adoptionsCount } = await supabaseServiceRoleClient
		.from("trees_adopted")
		.select("*", { count: "exact", head: true });

	const response = await fetch(PUMPS_URL);
	const geojson = await response.json();
	const numPumps = geojson.features.length;

	const stats: GdkStats = {
		numTrees: treesCount,
		numPumps: numPumps,
		numActiveUsers: usersCount,
		numWateringsThisYear: wateringsCount,
		averageNumWateringsPerMonth: [],
		averageAmountPerWateringsPerMonth: [],
		numTreeAdoptions: adoptionsCount,
		mostFrequentTreeSpecies: [],
	};

	return new Response(JSON.stringify(stats), {
		status: 200,
		headers: {
			...corsHeaders,
			"Content-Type": "application/json",
		},
	});
};

Deno.serve(handler);
