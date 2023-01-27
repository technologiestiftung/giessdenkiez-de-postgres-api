import { getPackage, Package } from "./package.js";

const pkg = getPackage();

interface ResponseData extends Package {
	[key: string]: string | number | Record<string, unknown> | undefined;
}
export function setupResponseData<T>(overrides?: T): ResponseData {
	return {
		version: pkg.version,
		name: pkg.name,
		// bugs: pkg.bugs?.url,
		// home: pkg.homepage,
		...overrides,
	};
}
