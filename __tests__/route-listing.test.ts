import { listRoutes } from "../_utils/routes-listing";
import { paramsToObject, validate } from "../_utils/validation";
const getRoutesList = listRoutes("GET");
const postRoutesList = listRoutes("POST");
const deleteRoutesList = listRoutes("DELETE");
describe("route listing", () => {
	test("should validate urlSearchParams", () => {
		const params = paramsToObject("uuid=1234&limit=10&offset=0");
		const [valid, _validationErrors] = validate(
			params,
			getRoutesList.routes.wateredandadopted.schema
		);

		expect(valid).toBe(false);
	});

	test("should list all DELETE routes", () => {
		expect(deleteRoutesList).toMatchSnapshot();
	});
	test("should list all POST routes", () => {
		expect(postRoutesList).toMatchSnapshot();
	});

	test("should list all the GET routes", async () => {
		expect(getRoutesList).toMatchSnapshot();
	});
});
