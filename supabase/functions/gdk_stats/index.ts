import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY");
const PUMPS_URL = Deno.env.get("PUMPS_URL");

console.log(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PUMPS_URL);

interface TreeSpecies {
	speciesName?: string;
	percentage: number;
}

interface Monthly {
	month: string;
	wateringCount: number;
	averageAmountPerWatering: number;
	totalSum: number;
}

interface Watering {
	id: string;
	lat: number;
	lng: number;
	amount: number;
	timestamp: string;
}

interface TreeAdoptions {
	count: number;
	veryThirstyCount: number;
}

interface GdkStats {
	numTrees: number;
	numPumps: number;
	numActiveUsers: number;
	numWateringsThisYear: number;
	monthlyWaterings: Monthly[];
	treeAdoptions: TreeAdoptions;
	mostFrequentTreeSpecies: TreeSpecies[];
	waterings: Watering[];
}

// As trees table barely changes, we can hardcode the values
// It would be too expensive to calculate on each request

// SELECT COUNT(1) FROM trees;
const TREE_COUNT = 885825;

// SELECT trees.gattung_deutsch, (COUNT(1) * 100.0) / (SELECT COUNT(1) FROM trees) AS percentage
// FROM trees
// GROUP BY trees.gattung_deutsch
// ORDER BY COUNT(1) DESC
// LIMIT 20;
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

const getAdoptedTreesCount = async (): Promise<TreeAdoptions> => {
	const { data, error } = await supabaseServiceRoleClient
		.rpc("calculate_adoptions")
		.select("*");

	return {
		count: data[0].total_adoptions,
		veryThirstyCount: data[0].very_thirsty_adoptions,
	} as TreeAdoptions;
};

const getMonthlyWaterings = async (): Promise<Monthly[]> => {
	const { data, error } = await supabaseServiceRoleClient
		.rpc("calculate_avg_waterings_per_month")
		.select("*");

	return data.map((month: any) => ({
		month: month.month,
		wateringCount: month.watering_count,
		totalSum: month.total_sum,
		averageAmountPerWatering: month.avg_amount_per_watering,
	}));
};

const getWaterings = async (): Promise<Watering[]> => {
	const { data, error } = await supabaseServiceRoleClient
		.rpc("get_waterings_with_location")
		.select("*");

	console.log(data, JSON.stringify(error));

	return data.map((watering: any) => {
		return {
			id: watering.id,
			lat: watering.lat,
			lng: watering.lng,
			amount: watering.amount,
			timestamp: watering.timestamp,
		};
	});
};

const handler = async (request: Request): Promise<Response> => {
	if (request.method === "OPTIONS") {
		return new Response(null, { headers: corsHeaders, status: 204 });
	}

	try {
		const [
			usersCount,
			wateringsCount,
			treeAdoptions,
			numPumps,
			monthlyWaterings,
			waterings,
		] = await Promise.all([
			getCount("profiles"),
			getWateringsCount(),
			getAdoptedTreesCount(),
			getPumpsCount(),
			getMonthlyWaterings(),
			getWaterings(),
		]);

		const stats: GdkStats = {
			numTrees: TREE_COUNT,
			numPumps: numPumps,
			numActiveUsers: usersCount,
			numWateringsThisYear: wateringsCount,
			monthlyWaterings: monthlyWaterings,
			treeAdoptions: treeAdoptions,
			mostFrequentTreeSpecies: MOST_FREQUENT_TREE_SPECIES,
			waterings: waterings,
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
