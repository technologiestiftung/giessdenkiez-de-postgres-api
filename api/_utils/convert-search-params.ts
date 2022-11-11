// var search = location.search.substring(1);
// JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) })

export default function convertSearchParams(searchParams: URLSearchParams) {
	const params: Record<string, any> = {};
	for (const [key, value] of searchParams) {
		params[key] = value;
	}
	return params;
}
