export enum ErrorTypes {
	GdkStatsPump = "gdk_stats_pumps",
	GdkStatsUser = "gdk_stats_users",
	GdkStatsWatering = "gdk_stats_waterings",
	GdkStatsAdoption = "gdk_stats_adoptions",
	GdkStatsTreeSpecie = "gdk_stats_tree_species",
	GdkStatsWeather = "gdk_stats_weather",
}

export class GdkError extends Error {
	constructor(message: string, public errorType: ErrorTypes) {
		super(message);
	}
}
