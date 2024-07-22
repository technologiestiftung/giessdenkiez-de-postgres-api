export interface TreeSpecies {
	speciesName?: string;
	percentage: number;
}

export interface Monthly {
	month: string;
	wateringCount: number;
	averageAmountPerWatering: number;
	totalSum: number;
}

export interface Watering {
	id: string;
	lat: number;
	lng: number;
	amount: number;
	timestamp: string;
}

export interface TreeAdoptions {
	count: number;
	veryThirstyCount: number;
}

export interface GdkStats {
	numTrees: number;
	numPumps: number;
	numActiveUsers: number;
	numWateringsThisYear: number;
	monthlyWaterings: Monthly[];
	treeAdoptions: TreeAdoptions;
	mostFrequentTreeSpecies: TreeSpecies[];
	totalTreeSpeciesCount: number;
	waterings: Watering[];
	monthlyWeather: MonthlyWeather[];
}

export interface MonthlyWeather {
	month: string;
	averageTemperatureCelsius: number;
	totalRainfallLiters: number;
}
