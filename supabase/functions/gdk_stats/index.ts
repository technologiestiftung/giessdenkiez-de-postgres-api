import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { loadEnvVars } from "../_shared/check-env.ts";
import {
	GdkStats,
	Monthly,
	MonthlyWeather,
	TreeAdoptions,
	TreeSpecies,
	Watering,
} from "../_shared/common.ts";
import { GdkError, ErrorTypes } from "../_shared/errors.ts";

const ENV_VARS = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "PUMPS_URL"];
const [SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PUMPS_URL] =
	loadEnvVars(ENV_VARS);

// As trees table barely changes, we can hardcode the values
// It would be too expensive to calculate on each request

// SELECT COUNT(1) FROM trees;
const TREE_COUNT = 116768;

// SELECT trees.gattung_deutsch, (COUNT(1) * 100.0) / (SELECT COUNT(1) FROM trees) AS percentage
// FROM trees
// GROUP BY trees.gattung_deutsch
// ORDER BY COUNT(1) DESC
// LIMIT 20;

//SELECT '{ speciesName: "' || coalesce(trees.gattung_deutsch, 'undefined') || '", percentage: ' || (COUNT(1) * 100.0) / (SELECT COUNT(1) FROM trees) || ' },'
// FROM trees
// GROUP BY trees.gattung_deutsch
// ORDER BY COUNT(1) DESC
// LIMIT 20;

const MOST_FREQUENT_TREE_SPECIES: TreeSpecies[] = [
    { speciesName: "Ahorne", percentage: 20.4876335982460948 },
    { speciesName: "Linden", percentage: 17.4568374897232118 },
    { speciesName: "Eichen", percentage: 8.2188613318717457 },
    { speciesName: "Prunus", percentage: 6.0744382022471910 },
    { speciesName: "Eschen", percentage: 4.4138805152096465 },
    { speciesName: "Rosskastanien", percentage: 4.2306111263359825 },
    { speciesName: undefined, percentage: 3.7912784324472458 },
    { speciesName: "Birken", percentage: 2.7550356261989586 },
    { speciesName: "Hainbuchen", percentage: 2.5512126610030145 },
    { speciesName: "Robinien", percentage: 2.3020005480953686 },
    { speciesName: "Platanen", percentage: 2.0673472184160044 },
    { speciesName: "Weißdorne", percentage: 2.0048300904357358 },
    { speciesName: "Birnen", percentage: 1.9722869279254590 },
    { speciesName: "Äpfel", percentage: 1.8909290216497671 },
    { speciesName: "Weiden", percentage: 1.5029802685667306 },
    { speciesName: "Kiefern", percentage: 1.4361811455193204 },
    { speciesName: "Pappeln", percentage: 1.3728076185256235 },
    { speciesName: "Erlen", percentage: 1.3060084954782132 },
    { speciesName: "Ulmen", percentage: 1.3025828994244999 },
    { speciesName: "Mehlbeeren", percentage: 1.2743217319813648 },
];

// SELECT COUNT(gattung_deutsch) FROM trees GROUP BY gattung_deutsch;
const TOTAL_TREE_SPECIES_COUNT = 92;

const supabaseServiceRoleClient = createClient(
	SUPABASE_URL,
	SUPABASE_SERVICE_ROLE_KEY
);

const getUserProfilesCount = async (): Promise<number> => {
	const { count } = await supabaseServiceRoleClient
		.from("profiles")
		.select("*", { count: "exact", head: true });

	if (count === null) {
		throw new GdkError(
			"Could not fetch count of profiles table",
			ErrorTypes.GdkStatsUser
		);
	}

	return count || 0;
};

const getWateringsCount = async (): Promise<number> => {
	const beginningOfYear = new Date(`${new Date().getFullYear()}-01-01`);
	const { count } = await supabaseServiceRoleClient
		.from("trees_watered")
		.select("*", { count: "exact", head: true })
		.gt("timestamp", beginningOfYear.toISOString());

	if (count === null) {
		throw new GdkError(
			"Could not fetch count of trees_watered table",
			ErrorTypes.GdkStatsWatering
		);
	}

	return count || 0;
};

const getPumpsCount = async (): Promise<number> => {
	const response = await fetch(PUMPS_URL);
	if (response.status !== 200) {
		throw new GdkError(response.statusText, ErrorTypes.GdkStatsPump);
	}
	const geojson = await response.json();
	return geojson.features.length;
};

const getAdoptedTreesCount = async (): Promise<TreeAdoptions> => {
	const { data, error } = await supabaseServiceRoleClient
		.rpc("calculate_adoptions")
		.select("*");

	if (error) {
		throw new GdkError(error.message, ErrorTypes.GdkStatsAdoption);
	}

	return {
		count: data[0].total_adoptions,
		veryThirstyCount: data[0].very_thirsty_adoptions,
	} as TreeAdoptions;
};

const getMonthlyWaterings = async (): Promise<Monthly[]> => {
	const { data, error } = await supabaseServiceRoleClient
		.rpc("calculate_avg_waterings_per_month")
		.select("*");

	if (error) {
		throw new GdkError(error.message, ErrorTypes.GdkStatsWatering);
	}

	return data.map((month: any) => ({
		month: month.month,
		wateringCount: month.watering_count,
		totalSum: month.total_sum,
		averageAmountPerWatering: month.avg_amount_per_watering,
	}));
};

const getMonthlyWeather = async (): Promise<MonthlyWeather[]> => {
	const { data, error } = await supabaseServiceRoleClient
		.rpc("get_monthly_weather")
		.select("*");

	if (error) {
		throw new GdkError(error.message, ErrorTypes.GdkStatsWeather);
	}

	return data.map((month: any) => ({
		month: month.month,
		averageTemperatureCelsius: month.avg_temperature_celsius,
		maximumTemperatureCelsius: month.max_temperature_celsius,
		totalRainfallLiters: month.total_rainfall_liters,
	}));
};

const getWaterings = async (): Promise<Watering[]> => {
	const { data, error } = await supabaseServiceRoleClient
		.rpc("get_waterings_with_location")
		.select("*");

	if (error) {
		throw new GdkError(error.message, ErrorTypes.GdkStatsWatering);
	}

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
			monthlyWeather,
		] = await Promise.all([
			getUserProfilesCount(),
			getWateringsCount(),
			getAdoptedTreesCount(),
			getPumpsCount(),
			getMonthlyWaterings(),
			getWaterings(),
			getMonthlyWeather(),
		]);

		const stats: GdkStats = {
			numTrees: TREE_COUNT,
			numPumps: numPumps,
			numActiveUsers: usersCount,
			numWateringsThisYear: wateringsCount,
			monthlyWaterings: monthlyWaterings,
			treeAdoptions: treeAdoptions,
			mostFrequentTreeSpecies: MOST_FREQUENT_TREE_SPECIES,
			totalTreeSpeciesCount: TOTAL_TREE_SPECIES_COUNT,
			waterings: waterings,
			monthlyWeather: monthlyWeather,
		};

		return new Response(JSON.stringify(stats), {
			status: 200,
			headers: {
				...corsHeaders,
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		if (error instanceof GdkError) {
			console.error(
				`Error of type ${error.errorType} in gdk_stats function invocation: ${error.message}`
			);
		} else {
			console.error(JSON.stringify(error));
		}

		return new Response(JSON.stringify(error), {
			status: 500,
			headers: {
				...corsHeaders,
				"Content-Type": "application/json",
			},
		});
	}
};

Deno.serve(handler);
