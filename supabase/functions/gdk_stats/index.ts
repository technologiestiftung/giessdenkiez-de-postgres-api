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

const supabaseServiceRoleClient = createClient(
	SUPABASE_URL,
	SUPABASE_SERVICE_ROLE_KEY
);

const getMostFrequentTreeSpecies = async (): Promise<TreeSpecies[]> => {
	const { data, error } = await supabaseServiceRoleClient
		.from("most_frequent_tree_species")
		.select("*");

	// rename all fields from gattung_deutsch to speciesName
	const renamedData = data.map((species) => ({
		speciesName: species.gattung_deutsch,
		percentage: species.percentage,
	}));

	if (error) {
		throw new GdkError(
			error.message,
			ErrorTypes.GdkStatsMostFrequentTreeSpecies
		);
	}

	return renamedData;
};

const getTotalTreeSpeciesCount = async (): Promise<number> => {
	const { data, error } = await supabaseServiceRoleClient
		.from("total_tree_species_count")
		.select("*");

	if (error) {
		throw new GdkError(error.message, ErrorTypes.GdkStatsTreeSpeciesCount);
	}

	return data[0].count ?? 0;
};

const getTreeCount = async (): Promise<number> => {
	const { data, error } = await supabaseServiceRoleClient
		.from("trees_count")
		.select("count");

	if (error) {
		throw new GdkError(error.message, ErrorTypes.GdkStatsTreeCount);
	}

	if (data === null) {
		throw new GdkError(
			"Could not fetch count of trees_count table",
			ErrorTypes.GdkStatsTreeCount
		);
	}

	return data[0].count ?? 0;
};

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
			treeCount,
			totalTreeSpeciesCount,
			mostFrequentTreeSpecies,
		] = await Promise.all([
			getUserProfilesCount(),
			getWateringsCount(),
			getAdoptedTreesCount(),
			getPumpsCount(),
			getMonthlyWaterings(),
			getWaterings(),
			getMonthlyWeather(),
			getTreeCount(),
			getTotalTreeSpeciesCount(),
			getMostFrequentTreeSpecies(),
		]);

		const stats: GdkStats = {
			numTrees: treeCount,
			numPumps: numPumps,
			numActiveUsers: usersCount,
			numWateringsThisYear: wateringsCount,
			monthlyWaterings: monthlyWaterings,
			treeAdoptions: treeAdoptions,
			mostFrequentTreeSpecies: mostFrequentTreeSpecies,
			totalTreeSpeciesCount: totalTreeSpeciesCount,
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
