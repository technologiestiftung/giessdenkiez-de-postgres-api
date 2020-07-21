import pg from "pg";
import { getEnvs } from "./envs";
import { Tree, AllTreesFiltered, TreeReduced, TreeWatered } from "./interfaces";

const {
  PG_PORT: port,
  PG_USER: user,
  PG_PASSWORD: password,
  PG_HOST: host,
  PG_DATABASE: database,
} = getEnvs();

export const dbConfig = {
  user,
  database,
  password,
  port,
  host,
};

const pool = new pg.Pool(dbConfig);

export async function getTreeById(id: string): Promise<Tree> {
  const result = await pool.query(
    `
    SELECT *
    FROM trees
    WHERE trees.id = $1`,
    [id],
  );
  return result.rows[0];
}

export async function getAdoptedTreeIdsByUserId(
  uuid: string,
): Promise<string[]> {
  const result = await pool.query(
    `
      SELECT tree_id
      FROM trees_adopted
      WHERE trees_adopted.uuid = $1;
  `,
    [uuid],
  );
  const data = result.rows.map((item) => item.tree_id);
  return data;
}

export async function getWateredTrees(): Promise<{ watered: string[] }> {
  const result = await pool.query(`
  SELECT tree_id
  FROM trees_watered
`);
  const data = {
    watered: result.rows.map((item) => item.tree_id),
  };
  return data;
}
export async function getTreesByAge(
  start: string,
  end: string,
): Promise<string[]> {
  const result = await pool.query(
    `
    SELECT id
    FROM trees
    WHERE trees.pflanzjahr >= $1
    AND trees.pflanzjahr <= $2;`,
    [Number(start), Number(end)],
  );
  const data = result.rows.map((row) => row.id);
  return data;
}
export async function getLastWateredTreeById(
  id: string,
): Promise<TreeWatered[]> {
  const result = await pool.query(
    `
    SELECT *
    FROM trees_watered
    WHERE trees_watered.tree_id = $1`,
    [id],
  );
  return result.rows;
}
export async function getAllTrees(
  offset: string,
  limit: string,
): Promise<AllTreesFiltered> {
  const result = await pool.query(
    `
    SELECT (id, lat, lng, radolan_sum)
    FROM trees
    ORDER BY id ASC
    OFFSET $1 LIMIT $2;
  `,
    [offset, limit],
  );

  const watered: TreeReduced[] = result.rows.map((item) => {
    const regExId = /(?<=\()(.*?)(?=,)/;

    const regExLat = /(?<=,)(.*?)(?=,)/;

    const regExLng = /([^,]*,){2}([^,]+)./;

    const regExSum = /([^,]*,){3}([^)]+)./;

    const id = item.row.match(regExId);

    const lat = item.row.match(regExLat);

    const lng = item.row.match(regExLng);

    const sum = item.row.match(regExSum);

    // This below is dirty work
    if (sum) {
      return [
        id[0] as string,
        lat ? parseFloat(lat[0]) : 0,
        lng ? parseFloat(lng[2]) : 0,
        sum ? parseFloat(sum[2]) : 0,
      ];
    } else {
      return [
        id[0] as string,
        lat ? parseFloat(lat[0]) : 0,
        lng ? parseFloat(lng[2]) : 0,
        0,
      ];
    }
  });

  const data = {
    watered,
  };
  return data;
}
