import pg from "pg";
import { Parser } from 'json2csv';
import { getEnvs } from "../envs";
import {
  Tree,
  AllTreesFiltered,
  TreeReduced,
  TreeWatered,
  TreeWateredAndAdopted,
  TreeAdopted,
} from "../common/interfaces";

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

export async function getTreeById(id: string): Promise<Tree[]> {
  const result = await pool.query(
    `
    SELECT *
    FROM trees
    WHERE trees.id = $1`,
    [id],
  );
  return result.rows;
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
  SELECT DISTINCT(tree_id)
  FROM trees_watered
  ORDER BY tree_id
`);
  const data = {
    watered: result.rows.map((item) => item.tree_id),
  };
  return data;
}

export async function getTreesWateredAndAdopted(): Promise<
  TreeWateredAndAdopted[]
> {
  const result = await pool.query(
    `
    WITH trees AS (SELECT tree_id, 1 AS adopted, 0 AS watered FROM trees_adopted
    UNION ALL
    SELECT tree_id, 0 AS adopted, CAST(trees_watered.amount AS INTEGER) AS watered FROM trees_watered WHERE trees_watered.timestamp >= NOW() - INTERVAL '30 days') SELECT tree_id, SUM(adopted) AS adopted, SUM(watered) AS watered FROM trees GROUP BY tree_id;
    `,
    [],
  );
  return result.rows;
}
export async function getTreesWateredByUser(
  uuid: string,
): Promise<TreeWatered[]> {
  const result = await pool.query(
    `
    SELECT *
    FROM trees_watered tw
    WHERE tw.uuid = $1 
    ORDER BY tw.timestamp ASC`,
    [uuid],
  );
  return result.rows;
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
    [parseInt(start, 10), parseInt(end, 10)],
  );
  const data = result.rows.map((row) => row.id);
  return data;
}

export async function isTreeAdoptedByUser(
  uuid: string,
  tree_id: string,
): Promise<boolean> {
  const result = await pool.query(
    `
    SELECT *
    FROM trees_adopted
    WHERE trees_adopted.uuid = $1 AND trees_adopted.tree_id = $2
    `,
    [uuid, tree_id],
  );
  return result.rows.length > 0 ? true : false;
}
export async function countTreesByAge(
  start: string,
  end: string,
): Promise<{ count: number }> {
  const result = await pool.query(
    `
    SELECT COUNT(*)
    FROM trees
    WHERE trees.pflanzjahr >= $1
    AND trees.pflanzjahr <= $2;`,
    [parseInt(start, 10), parseInt(end, 10)],
  );

  const data = parseInt(result.rows[0].count, 10);
  return { count: data };
}

export async function getLastWateredTreeById(
  id: string,
): Promise<TreeWatered[]> {
  const result = await pool.query(
    `SELECT tw.*, u.username AS username_set, u.prefered_username FROM trees_watered tw 
     LEFT OUTER JOIN users u ON tw.uuid = u.uuid WHERE tw.tree_id = $1 ORDER BY tw.timestamp ASC`,
    [id],
  );
  return result.rows.map(row => ({
    username: row.prefered_username || row.username_set || row.username,
    username_set: undefined,
    prefered_username: undefined,
    ...row,
  }));
}

export async function getTreesByIds(tree_ids: string): Promise<Tree[]> {
  // this is done in the frontend m(

  const result = await pool.query(
    `
    SELECT * FROM trees
    WHERE id = ANY ($1);
  `,
    [`{${tree_ids}}`],
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

interface UserProps {
  uuid: string;
  email: string;
  username: string;
  prefered_username: string;
  family_name: string;
  given_name: string;
  salutation: string;
  street_with_number: string;
  zipcode: string;
  phone_number: string;
}

export async function getUserById(uuid: string): Promise<UserProps> {
  const result = await pool.query(
    `SELECT uuid, email, username, prefered_username, family_name, given_name, salutation, street_with_number, 
     zipcode, phone_number FROM users WHERE uuid = $1
    `,
    [uuid],
  );
  return result.rows.length > 0 && result.rows[0];
}

export async function exportUserData(): Promise<string> {
  const fields = [
    "uuid", "email", "username", "prefered_username", "family_name", "given_name", 
    "salutation", "street_with_number", "zipcode", "phone_number"
  ]
  const result = await pool.query(
    `SELECT ${fields.join(", ")} FROM users WHERE uuid = $1
    `,
    [],
  );
  return convertToCsv(result.rows, fields);
}

function convertToCsv(data: UserProps[], fields: string[]): string {
  const json2csv = new Parser({ fields });
  return json2csv.parse(data);
}


// POST POST POST POST POST POST POST POST POST
// POST POST POST POST POST POST POST POST POST POST
// POST POST POST POST POST POST POST POST POST POST POST

/**
 * Adopts a tree
 * @todo Check if tree actually exists
 */
export async function adoptTree(
  tree_id: string,
  uuid: string,
): Promise<string> {
  await pool.query(
    `
     INSERT INTO trees_adopted (tree_id, uuid)
     VALUES ($1, $2);
  `,
    [tree_id, uuid],
  );
  // console.log(res);
  return `tree ${tree_id} was adopted by user ${uuid}`;
}

interface WaterTreeProps {
  tree_id: string;
  uuid: string;
  amount: number;
  username: string;
}
export async function waterTree(opts: WaterTreeProps): Promise<string> {
  const { tree_id, uuid, amount, username } = opts;
  await pool.query(
    `
    INSERT INTO trees_watered (tree_id, time, uuid, amount, timestamp, username)
    VALUES ($1, clock_timestamp(), $2, $3, clock_timestamp(), $4)
  `,
    [tree_id, uuid, amount, username],
  );
  return `Tree with tree_id ${tree_id} was watered by user ${uuid}/${username} with ${amount}l of water`;
}
interface PatchProp {
  name: string;
  value: string;
}

interface UserCreateProps {
  uuid: string;
  email: string,
  username: string,
  patches: PatchProp[];
}

interface PatchProps {
  uuid: string;
  patches: PatchProp[];
}

export async function createUserProfile(opts: UserCreateProps): Promise<UserProps> {
  const { uuid, email, username, patches } = opts;
  const uuidResult = await pool.query(
    `SELECT uuid FROM users WHERE uuid = $1`,
    [uuid],
  );
  if (uuidResult.rows.length > 0) {
    throw new Error(
      "The user profile already exists",
    );
  }
  const emailResult = await pool.query(
    `SELECT uuid FROM users WHERE email = $1`,
    [email],
  );
  if (emailResult.rows.length > 0) {
    throw new Error(
      "There is already a user with that email",
    );
  }
  await pool.query(
    `
    INSERT INTO users (uuid, email, username, created)
    VALUES ($1, $2, $3, clock_timestamp())
  `,
    [uuid, email, username],
  );
  return updateUserProfile({
    uuid,
    patches: patches || []
  })
}

export async function updateUserProfile(opts: PatchProps): Promise<UserProps> {
  const supportedProps: String[] = [
    "prefered_username",
    "family_name",
    "given_name",
    "salutation",
    "street_with_number",
    "zipcode",
    "phone_number",
  ]
  const { uuid, patches } = opts;
  if (patches && Array.isArray(patches)) {
    for (let patch of patches) {
      if (supportedProps.indexOf(patch.name) >= 0) {
        var oldValue;
        if (patch.name == "prefered_username") {
          const result = await pool.query(
            `SELECT username, prefered_username FROM users WHERE uuid = $1`,
            [uuid],
          );
          const entry = result.rows.length > 0 && result.rows[0];
          oldValue = entry && (entry.prefered_username || entry.username);
        } else if (supportedProps.indexOf(patch.name) >= 0) {
          const result = await pool.query(
            `SELECT ${patch.name} FROM users WHERE uuid = $1`,
            [uuid],
          );
          const entry = result.rows.length > 0 && result.rows[0];
          oldValue = entry && entry[patch.name];
        }
        if (supportedProps.indexOf(patch.name) >= 0) {
          const value = (patch.value === undefined || patch.value === null || patch.value === "") ? null : patch.value
          await pool.query(
            `UPDATE users SET ${patch.name} = $2, updated = now() WHERE uuid = $1`,
            [uuid, value],
          );
          if (patch.name == "prefered_username" && oldValue !== patch.value) {
            await pool.query(
              `UPDATE trees_watered SET username = $2 WHERE uuid = $1`,
              [uuid, value],
            );  
          }  
        }
      } else {
        console.log(`Property ${patch.name} isn't supported for update`)
      }
    }  
  }
  const result = await pool.query(
    `SELECT uuid, email, username, prefered_username, family_name, given_name, salutation, street_with_number, zipcode, phone_number FROM users WHERE uuid = $1`,
    [uuid],
  );
  return result.rows.length > 0 && result.rows[0];
}

// DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE
// DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE
// DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE
// DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE

/**
 * Unadopt a tree
 *
 */
export async function unadoptTree(
  tree_id: string,
  uuid: string,
): Promise<string> {
  const response = await pool.query(
    `
    DELETE FROM trees_adopted
    WHERE tree_id = $1 AND uuid = $2;
  `,
    [tree_id, uuid],
  );

  return response.rowCount > 0
    ? `tree ${tree_id} was unadopted by user ${uuid}`
    : `tree ${tree_id} or user ${uuid} don't exist`;
}
