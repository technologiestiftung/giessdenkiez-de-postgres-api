export const loadEnvVars = (vars: string[]) => {
	const missingVars = vars.filter((v) => !Deno.env.get(v));
	if (missingVars.length > 0) {
		throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);
	}
	return vars.map((v) => Deno.env.get(v));
};
