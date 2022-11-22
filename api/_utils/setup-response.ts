import { Generic } from "./common/interfaces";
import { getPackage } from "./package";

const pkg = getPackage();

export function setupResponseData(overrides?: Generic): Generic {
	return {
		version: pkg.version,
		name: pkg.name,
		bugs: pkg.bugs?.url,
		home: pkg.homepage,
		...overrides,
	};
}
