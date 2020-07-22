/* eslint-disable jest/no-hooks */
import {
  getTreeById,
  getAdoptedTreeIdsByUserId,
  getWateredTrees,
  getTreesByAge,
  getAllTrees,
  getLastWateredTreeById,
} from "./db-manager";
import pg from "pg";
import format from "pg-format";
const client = new pg.Client({
  user: "fangorn",
  database: "trees",
  password: "ent",
  host: "127.0.01",
});

jest.mock("../envs", () => {
  return {
    getEnvs: () => {
      return {
        PG_USER: process.env.user ? process.env.user : "fangorn",
        PG_DATABASE: process.env.database ? process.env.database : "trees",
        PG_PASSWORD: process.env.password ? process.env.password : "ent",
        PG_PORT: process.env.port ? parseInt(process.env.port, 10) : 5432,
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
    await client.query("DELETE FROM trees WHERE id = $1", ["_abc"]);
  });

  test("getting Adopted trees by userId auth0id", async () => {
    await client.query(
      "INSERT INTO trees_adopted (tree_id, uuid) VALUES ($1, $2)",
      ["_abc", "auth0|123"],
    );
    const res = await getAdoptedTreeIdsByUserId("auth0|123");

    expect(res).toBeDefined();
    expect(Array.isArray(res)).toBe(true);
    await client.query("DELETE FROM trees_adopted WHERE tree_id = $1", [
      "_abc",
    ]);
  });
  test("getting all watered trees", async () => {
    const values = [
      ["_abc", 1],
      ["_def", 1],
      ["_ghi", 1],
    ];
    const sql = format(
      "INSERT INTO trees_watered (tree_id, time) VALUES %L",
      values,
    );
    await client.query(sql);
    const res = await getWateredTrees();
    expect(res).toBeDefined();
    expect(res.watered).toBeDefined();
    expect(Array.isArray(res.watered)).toBe(true);
    await client.query("DELETE FROM trees_watered WHERE tree_id LIKE $1", [
      `%${"_"}%`,
    ]);
  });

  test("getting watered trees by id", async () => {
    const values = [
      ["_abc", 1],
      ["_def", 1],
      ["_ghi", 1],
    ];
    const sql = format(
      "INSERT INTO trees_watered (tree_id, time) VALUES %L",
      values,
    );
    await client.query(sql);
    const res = await getLastWateredTreeById("_abc");
    expect(res).toBeDefined();
    expect(res[0].tree_id).toBe("_abc");
    await client.query("DELETE FROM trees_watered WHERE tree_id LIKE $1", [
      `%${"_"}%`,
    ]);
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

    await client.query("DELETE FROM trees WHERE id LIKE $1", [`%${"_"}%`]);
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

    await client.query("DELETE FROM trees WHERE id LIKE $1", [`%${"_"}%`]);
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

    await client.query("DELETE FROM trees WHERE id LIKE $1", [`%${"_"}%`]);
  });
});
