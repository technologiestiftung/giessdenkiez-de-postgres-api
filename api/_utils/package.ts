import fs from "fs";
import path from "path";

const pkgStr = fs.readFileSync(
	path.resolve(__dirname, "../../package.json"),
	"utf8",
);

interface Package {
	[key: string]: string | number | Record<string, unknown> | undefined;
	version: string;
	name: string;
	homepage?: string;
	bugs?: {
		url: string;
		[key: string]: string | number | Record<string, unknown>;
	};
}
export function getPackage(): Package {
	const pkg = JSON.parse(pkgStr);
	return pkg;
}
