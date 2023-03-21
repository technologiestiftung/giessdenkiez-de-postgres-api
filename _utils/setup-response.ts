import { getPackage } from "./package";

const pkg = getPackage();

// interface ResponseData extends Package {
// 	[key: string]: string | number | Record<string, unknown> | undefined;
// 	range: ContentRange | undefined;
// }
export function setupResponseData<T>(overrides?: T) {
	return {
		version: pkg.version,
		name: pkg.name,
		// bugs: pkg.bugs?.url,
		// home: pkg.homepage,
		...overrides,
	};
}
