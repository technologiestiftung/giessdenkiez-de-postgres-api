/* eslint-disable jest/no-hooks */
import {
	getTreeById,
	getAdoptedTreeIdsByUserId,
	getWateredTrees,
	getTreesByAge,
	getAllTrees,
	getLastWateredTreeById,
	getTreesWateredByUser,
	unadoptTree,
	unwaterTree,
	waterTree,
	adoptTree,
	getTreesByIds,
	countTreesByAge,
	isTreeAdoptedByUser,
	getTreesWateredAndAdopted,
} from "./db-manager";
import pg from "pg";

import format from "pg-format";
const client = new pg.Client({
	user: "postgres",
	database: "postgres",
	password: "postgres",
	port: 54322,
	host: "127.0.01",
});

jest.mock("../envs", () => {
	return {
		getEnvs: () => {
			return {
				PG_USER: process.env.user ? process.env.user : "postgres",
				PG_DATABASE: process.env.database ? process.env.database : "postgres",
				PG_PASSWORD: process.env.password ? process.env.password : "postgres",
				PG_PORT: process.env.port ? parseInt(process.env.port, 10) : 54322,
				PG_HOST: process.env.host ? process.env.host : "localhost",
				jwksUri: "",
				audience: "",
				issuer: "",
			};
		},
	};
});
// INSERT INTO trees (id) VALUES ('_abc');
// DELETE FROM trees WHERE id = '_abc';
async function connect() {
	await client.connect();
}

async function close() {
	await client.end();
}
describe("db-manager", () => {
	beforeEach(async () => {
		await client.query("TRUNCATE trees, trees_watered, trees_adopted CASCADE");
	});
	afterEach(async () => {
		await client.query("TRUNCATE trees, trees_watered, trees_adopted CASCADE");
	});
	beforeAll(async () => {
		await connect();
	});
	afterAll(async () => {
		jest.restoreAllMocks();
		await close();
	});
	test("getting tree by id", async () => {
		await client.query("INSERT INTO trees (id) VALUES ($1)", ["_abc"]);
		const res = await getTreeById("_abc");

		expect(res).toBeDefined();
		// await client.query("DELETE FROM trees WHERE id = $1", ["_abc"]);
	});

	test("getting Adopted trees by userId auth0id", async () => {
		await client.query("INSERT INTO trees (id) VALUES ($1)", ["_abc"]);
		await client.query(
			"INSERT INTO trees_adopted (tree_id, uuid) VALUES ($1, $2)",
			["_abc", "auth0|123"],
		);
		const res = await getAdoptedTreeIdsByUserId("auth0|123");

		expect(res).toBeDefined();
		expect(Array.isArray(res)).toBe(true);
		// await client.query("DELETE FROM trees_adopted WHERE tree_id = $1", [
		//   "_abc",
		// ]);
	});
	test("getting all watered trees", async () => {
		const today = new Date("2020-01-01T00:00:00.000Z").toISOString();
		const values = [
			["_abc", today, today],
			["_def", today, today],
			["_ghi", today, today],
		];

		const sqlTrees = format(
			"INSERT INTO trees (id) VALUES %L",
			values.map(([id]) => [id]),
		);
		await client.query(sqlTrees);

		const sql = format(
			"INSERT INTO trees_watered (tree_id, time, timestamp) VALUES %L",
			values,
		);
		await client.query(sql);
		const res = await getWateredTrees();
		expect(res).toBeDefined();
		expect(res.watered).toBeDefined();
		expect(Array.isArray(res.watered)).toBe(true);
		// await client.query("DELETE FROM trees_watered WHERE tree_id LIKE $1", [
		//   `%${"_"}%`,
		// ]);
	});

	test("getting watered trees by id", async () => {
		const today = new Date("2020-01-01T00:00:00.000Z").toISOString();
		const values = [
			["_abc", today, today],
			["_def", today, today],
			["_ghi", today, today],
		];

		const sqlTrees = format(
			"INSERT INTO trees (id) VALUES %L",
			values.map(([id]) => [id]),
		);
		await client.query(sqlTrees);

		const sql = format(
			"INSERT INTO trees_watered (tree_id, time, timestamp) VALUES %L",
			values,
		);
		await client.query(sql);
		const res = await getLastWateredTreeById("_abc");
		expect(res).toBeDefined();
		expect(res[0].tree_id).toBe("_abc");
		// TODO: [GDK-215] Remove object wrapper when https://github.com/facebook/jest/issues/13352 is resolved
		expect({ res }).toMatchSnapshot({ res: [{ id: expect.any(Number) }] });
	});
	test("getting trees by age", async () => {
		const values = [
			["_abc", "1800"],
			["_def", "1810"],
			["_ghi", "1820"],
			["_jkl", "1830"],
		];
		const sql = format("INSERT INTO trees (id, pflanzjahr) VALUES %L", values);
		await client.query(sql);
		const res = await getTreesByAge("1810", "1820");
		expect(res).toBeDefined();
		expect(Array.isArray(res)).toBe(true);
		expect(res).toHaveLength(2);

		// await client.query("DELETE FROM trees WHERE id LIKE $1", [`%${"_"}%`]);
	});
	test("getting all trees using offset and limit", async () => {
		const values = [
			["_def", "1810"],
			["_ghi", "1820"],
			["_jkl", "1830"],
			["_abc", "1800"],
		];
		const sql = format("INSERT INTO trees (id, pflanzjahr) VALUES %L", values);
		await client.query(sql);
		const res = await getAllTrees("1", "2");
		expect(res).toBeDefined();
		expect(Array.isArray(res.watered)).toBe(true);
		expect(res.watered).toHaveLength(2);
		expect(res.watered[0]).toHaveLength(4);

		// await client.query(sqlTruncate("trees"));
	});
	test("getting all trees using offset and limit with sum", async () => {
		const values = [
			["_def", "1810", 100, 13, 52],
			["_ghi", "1820", 100, 13, 52],
			["_jkl", "1830", 100, 13, 52],
			["_abc", "1800", 100, 13, 52],
		];
		const sql = format(
			"INSERT INTO trees (id, pflanzjahr, radolan_sum, lat, lng) VALUES %L",
			values,
		);
		await client.query(sql);
		const res = await getAllTrees("1", "2");
		expect(res).toBeDefined();
		expect(Array.isArray(res.watered)).toBe(true);
		expect(res.watered).toHaveLength(2);
		expect(res.watered[0]).toHaveLength(4);
		expect(res.watered[0]).toStrictEqual(["_def", 13, 52, 100]);
		expect(res.watered[1]).toStrictEqual(["_ghi", 13, 52, 100]);

		// await client.query(sqlTruncate("trees"));
	});

	test("getting trees watered by user", async () => {
		const today = new Date("2020-07-23T17:11:33Z").toISOString();
		const values = [
			["_08be12a72n", "auth0|G65iUi8WGI", today, today],
			["_R447NTgmyk", "auth0|TDilMAYKVk", today, today],
			["_dCCFXUp0M5", "auth0|w_F-8Oqkn7", today, today],
			["_cBw9mi9_VG", "auth0|448ef305kj", today, today],
		];

		const sqlTrees = format(
			"INSERT INTO trees (id) VALUES %L",
			values.map(([id]) => [id]),
		);
		await client.query(sqlTrees);

		const sql = format(
			"INSERT INTO trees_watered (tree_id, uuid, time, timestamp) VALUES %L",
			values,
		);
		await client.query(sql);
		const res = await getTreesWateredByUser(values[0][1]);
		expect({ res }).toMatchSnapshot({
			res: [
				{
					id: expect.any(Number),
					time: expect.any(String),
					timestamp: expect.any(Date),
				},
			],
		});
		// await client.query(sqlTruncate("trees_watered"));
	});

	test("getTreesWateredAndAdopted", async () => {
		const valuesAdopted: [number, string, string][] = [
			[1, "_08be12a72n", "auth0|G65iUi8WGI"],
			[3, "_dCCFXUp0M5", "auth0|w_F-8Oqkn7"],
			[4, "_cBw9mi9_VG", "auth0|448ef305kj"],
		];

		const sqlTrees = format(
			"INSERT INTO trees (id) VALUES %L",
			valuesAdopted.map(([_, id]) => [id]),
		);
		await client.query(sqlTrees);

		const sqlAdopted = format(
			"INSERT INTO trees_adopted (id,tree_id,uuid) VALUES %L",
			valuesAdopted,
		);
		await client.query(sqlAdopted);

		const date = new Date().toISOString();
		const valuesWatered = [["_08be12a72n", date, "auth0|G65iUi8WGI", date]];

		const sqlWatered = format(
			"INSERT INTO trees_watered (tree_id,time,uuid,timestamp) VALUES %L",
			valuesWatered,
		);
		await client.query(sqlWatered);

		const res = await getTreesWateredAndAdopted();
		expect({ res }).toMatchSnapshot();

		for (const tree of res) {
			// eslint-disable-next-line jest/no-if
			if (tree.tree_id === valuesWatered[0][0]) {
				// eslint-disable-next-line jest/no-conditional-expect
				expect(tree.watered).toBe("1");
			} else {
				// eslint-disable-next-line jest/no-conditional-expect
				expect(tree.watered).toBe("0");
			}
		}
	});
	test("isTreeAdoptedByUser", async () => {
		const values: [number, string, string][] = [
			[1, "_08be12a72n", "auth0|G65iUi8WGI"],
			[3, "_dCCFXUp0M5", "auth0|w_F-8Oqkn7"],
			[4, "_cBw9mi9_VG", "auth0|448ef305kj"],
		];

		const sqlTrees = format(
			"INSERT INTO trees (id) VALUES %L",
			values.map(([_, id]) => [id]),
		);
		await client.query(sqlTrees);
		const sqlAdopted = format(
			"INSERT INTO trees_adopted (id,tree_id,uuid) VALUES %L",
			values,
		);
		await client.query(sqlAdopted);
		const res = await isTreeAdoptedByUser(values[1][2], values[1][1]);
		expect(res).toMatchInlineSnapshot(`true`);

		expect(res).toBe(true);
	});
	test("countTreesByAge", async () => {
		const values = [
			["_08be12a72n", "1910"],
			["_R447NTgmyk", "1920"],
			["_cBw9mi9_VG", "1931"],
			["_sfdslkslkj", "1932"],
			["_dfdfsdfkjh", "1940"],
		];

		const sql = format("INSERT INTO trees (id, pflanzjahr) VALUES %L", values);
		await client.query(sql);
		const res = await countTreesByAge("1930", "1933");
		expect(res).toMatchInlineSnapshot(`
		{
		  "count": 2,
		}
	`);
		expect(res.count).toBe(2);
	});

	test("getTreeByIds", async () => {
		const values = [["_08be12a72n"], ["_R447NTgmyk"], ["_cBw9mi9_VG"]];
		const sql = format("INSERT INTO trees (id) VALUES %L", values);
		await client.query(sql);
		expect(await getTreesByIds(values[0].join(","))).toMatchInlineSnapshot(`
		[
		  {
		    "adopted": null,
		    "artbot": null,
		    "artdtsch": null,
		    "baumhoehe": null,
		    "bezirk": null,
		    "caretaker": null,
		    "eigentuemer": null,
		    "gattung": null,
		    "gattungdeutsch": null,
		    "geom": null,
		    "gmlid": null,
		    "hausnr": null,
		    "id": "_08be12a72n",
		    "kennzeich": null,
		    "kronedurch": null,
		    "lat": null,
		    "lng": null,
		    "pflanzjahr": null,
		    "radolan_days": null,
		    "radolan_sum": null,
		    "stammumfg": null,
		    "standalter": null,
		    "standortnr": null,
		    "strname": null,
		    "type": null,
		    "watered": null,
		    "zusatz": null,
		  },
		]
	`);
	});

	test("adoptTree", async () => {
		await client.query("INSERT INTO trees (id) VALUES ($1)", ["_08be12a72n"]);

		const values = { tree_id: "_08be12a72n", uuid: "auth0|123" };
		expect(await adoptTree(values.tree_id, values.uuid)).toMatchInlineSnapshot(
			`"tree _08be12a72n was adopted by user auth0|123"`,
		);

		const res = await client.query(
			"SELECT tree_id, uuid from trees_adopted where tree_id LIKE $1",
			[values.tree_id],
		);
		expect(res.rows[0]).toStrictEqual({
			tree_id: values.tree_id,
			uuid: values.uuid,
		});
	});

	test("waterTree", async () => {
		await client.query("INSERT INTO trees (id) VALUES ($1)", ["_08be12a72n"]);

		const opts = {
			tree_id: "_08be12a72n",
			timestamp: "2020-01-01T00:00:00.000Z",
			username: "bunny",
			uuid: "auth0|TDilMAYKVk",
			amount: 100,
		};
		expect(await waterTree(opts)).toMatchInlineSnapshot(
			`"Tree with tree_id _08be12a72n was watered by user auth0|TDilMAYKVk/bunny with 100l of water"`,
		);
		await client.query(`
      set time zone UTC;
    `);
		const res = await client.query(
			"SELECT tree_id, timestamp, username, uuid, amount FROM trees_watered WHERE uuid LIKE $1",
			[opts.uuid],
		);
		expect({
			...res.rows[0],
			timestamp: res.rows[0].timestamp.toISOString(),
		}).toStrictEqual({
			tree_id: opts.tree_id,
			timestamp: opts.timestamp,
			username: opts.username,
			uuid: opts.uuid,
			amount: `${opts.amount}`,
		});
	});

	test("unadoptTree", async () => {
		const values: [number, string, string][] = [
			[1, "_08be12a72n", "auth0|G65iUi8WGI"],
			[2, "_R447NTgmyk", "auth0|TDilMAYKVk"],
			[3, "_dCCFXUp0M5", "auth0|w_F-8Oqkn7"],
			[4, "_cBw9mi9_VG", "auth0|448ef305kj"],
		];
		const sqlTrees = format(
			"INSERT INTO trees (id) VALUES %L",
			values.map(([_, id]) => [id]),
		);
		await client.query(sqlTrees);
		const sqlAdopted = format(
			"INSERT INTO trees_adopted (id,tree_id,uuid) VALUES %L",
			values,
		);
		await client.query(sqlAdopted);
		expect(await unadoptTree(values[1][1], values[1][2])).toMatchInlineSnapshot(
			`"tree _R447NTgmyk was unadopted by user auth0|TDilMAYKVk"`,
		);
	});

	test("unwaterTree", async () => {
		const today = new Date("2020-01-01 00:00:00").toISOString();
		const values: [number, string, string][] = [
			[1, "_08be12a72n", "auth0|G65iUi8WGI"],
			[2, "_R447NTgmyk", "auth0|TDilMAYKVk"],
			[3, "_dCCFXUp0M5", "auth0|w_F-8Oqkn7"],
			[4, "_cBw9mi9_VG", "auth0|448ef305kj"],
		];
		const sqlTrees = format(
			"INSERT INTO trees (id) VALUES %L",
			values.map(([_, id]) => [id]),
		);
		await client.query(sqlTrees);
		const sqlWatered = format(
			"INSERT INTO trees_watered (id,tree_id,uuid,timestamp,time) VALUES %L",
			values.map((arr) => [...arr, today, today]),
		);
		await client.query(sqlWatered);
		const [watering_id, tree_id, uuid] = values[1];
		expect(await unwaterTree(watering_id, tree_id, uuid)).toMatchInlineSnapshot(
			`"The watering with id 2 on tree _R447NTgmyk was deleted by user auth0|TDilMAYKVk"`,
		);
	});
});
