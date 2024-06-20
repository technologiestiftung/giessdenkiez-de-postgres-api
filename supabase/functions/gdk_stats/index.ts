import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const PUMPS_URL = Deno.env.get("PUMPS_URL");

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
	monthlyWaterings: Monthly[];
	numTreeAdoptions: number;
	mostFrequentTreeSpecies: TreeSpecies[];
}

const HARD_CODED_TREE_COUNT = 885825;
const MOST_FREQUENT_TREE_SPECIES: TreeSpecies[] = [
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

const supabaseServiceRoleClient = createClient(
	SUPABASE_URL,
	SUPABASE_SERVICE_ROLE_KEY
);

const getCount = async (tableName: string): Promise<number> => {
	const { count } = await supabaseServiceRoleClient
		.from(tableName)
		.select("*", { count: "exact", head: true });
	return count || 0;
};

const getWateringsCount = async (): Promise<number> => {
	const beginningOfYear = new Date(`${new Date().getFullYear()}-01-01`);
	const { count } = await supabaseServiceRoleClient
		.from("trees_watered")
		.select("*", { count: "exact", head: true })
		.gt("timestamp", beginningOfYear.toISOString());
	return count || 0;
};

const getPumpsCount = async (): Promise<number> => {
	const response = await fetch(PUMPS_URL);
	const geojson = await response.json();
	return geojson.features.length;
};

const getMonthlyWaterings = async (): Promise<Monthly[]> => {
	const { data, error } = await supabaseServiceRoleClient
		.rpc("calculate_avg_waterings_per_month")
		.select("*");
	return data.map((month: any) => ({
		month: month.month,
		wateringCount: month.watering_count,
		averageAmountPerWatering: month.avg_amount_per_watering,
	}));
};

const handler = async (request: Request): Promise<Response> => {
	if (request.method === "OPTIONS") {
		return new Response(null, { headers: corsHeaders, status: 204 });
	}

	try {
		const [
			usersCount,
			wateringsCount,
			adoptionsCount,
			numPumps,
			monthlyWaterings,
		] = await Promise.all([
			getCount("profiles"),
			getWateringsCount(),
			getCount("trees_adopted"),
			getPumpsCount(),
			getMonthlyWaterings(),
		]);

		const stats: GdkStats = {
			numTrees: HARD_CODED_TREE_COUNT,
			numPumps: numPumps,
			numActiveUsers: usersCount,
			numWateringsThisYear: wateringsCount,
			monthlyWaterings: monthlyWaterings,
			numTreeAdoptions: adoptionsCount,
			mostFrequentTreeSpecies: MOST_FREQUENT_TREE_SPECIES,
		};

		return new Response(JSON.stringify(stats), {
			status: 200,
			headers: {
				...corsHeaders,
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: {
				...corsHeaders,
				"Content-Type": "application/json",
			},
		});
	}
};

Deno.serve(handler);
