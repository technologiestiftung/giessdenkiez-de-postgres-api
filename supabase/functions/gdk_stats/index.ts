import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("URL");
const SUPABASE_ANON_KEY = Deno.env.get("ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY");
const PUMPS_URL =
	"https://ieokxbqvqedpcyvwmrsb.supabase.co/storage/v1/object/public/data_assets/pumps.geojson";

interface TreeSpecies {
	speciesName?: string;
	percentage: number;
}

interface Monthly {
	month: string;
	wateringCount: number;
	averageAmountPerWatering: number;
}

interface GdkStats {
	numTrees: number;
	numPumps: number;
	numActiveUsers: number;
	numWateringsThisYear: number;
	monthlyWaterings: Monthly[]; // Last 12 months
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

	const { data } = await supabaseServiceRoleClient
		.rpc("calculate_avg_waterings_per_month")
		.select("*");

	const monthlyWaterings = data.map((month: any) => {
		return {
			month: month.month,
			wateringCount: month.watering_count,
			averageAmountPerWatering: month.avg_amount_per_watering,
		};
	});

	// As tree count barely changes, we can hardcode it, would be too expensive to fetch it every time
	// SELECT trees.gattung_deutsch, (COUNT(1) * 100.0) / (SELECT COUNT(1) FROM trees) AS percentage
	// FROM trees
	// GROUP BY trees.gattung_deutsch
	// ORDER BY COUNT(1) DESC;
	const mostFrequentTreeSpecies = [
		{ speciesName: "AHORN", percentage: 22.8128580701605848 },
		{ speciesName: "LINDE", percentage: 21.5930911861823724 },
		{ speciesName: "EICHE", percentage: 10.5370699630288149 },
		{ speciesName: undefined, percentage: 4.1923630513927695 },
		{ speciesName: "ROBINIE", percentage: 3.9515705698078063 },
		{ speciesName: "ROSSKASTANIE", percentage: 3.6574944260999633 },
		{ speciesName: "BIRKE", percentage: 3.610419665283775 },
		{ speciesName: "HAINBUCHE", percentage: 3.4514717918324726 },
		{ speciesName: "PLATANE", percentage: 3.3499844777467333 },
		{ speciesName: "PAPPEL", percentage: 2.8882679987582197 },
		{ speciesName: "ESCHE", percentage: 2.7732339909124263 },
		{ speciesName: "KIEFER", percentage: 2.4801738492365874 },
		{ speciesName: "ULME", percentage: 1.946998560663788 },
		{ speciesName: "BUCHE", percentage: 1.7521519487483419 },
		{ speciesName: "HASEL", percentage: 1.1728050122766912 },
		{ speciesName: "WEIßDORN", percentage: 1.1243755820844975 },
		{ speciesName: "WEIDE", percentage: 1.0893799565376909 },
		{ speciesName: "MEHLBEERE", percentage: 0.90469336494228544013 },
		{ speciesName: "ERLE", percentage: 0.80907628481923630514 },
		{ speciesName: "APFEL", percentage: 0.70092851296813704739 },
	];

	const stats: GdkStats = {
		numTrees: treesCount,
		numPumps: numPumps,
		numActiveUsers: usersCount,
		numWateringsThisYear: wateringsCount,
		monthlyWaterings: monthlyWaterings,
		numTreeAdoptions: adoptionsCount,
		mostFrequentTreeSpecies: mostFrequentTreeSpecies,
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
