const pg = require("pg");

var config = {
  user: process.env.user,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port,
  host: process.env.host,
};

var pool = new pg.Pool(config);
module.exports = async (req, res, next) => {
  try {
    const { uuid, treeid } = req.query;
    const result = await pool.query(
      `
      WITH trees AS (SELECT tree_id, 1 AS adopted, 0 AS watered FROM trees_adopted
      UNION ALL
      SELECT tree_id, 0 AS adopted, 1 AS watered FROM trees_watered WHERE trees_watered.timestamp >= NOW() - INTERVAL '30 days') SELECT tree_id, SUM(adopted) AS adopted, SUM(watered) AS watered FROM trees GROUP BY tree_id;
      `,
      [],
    );

    res.json(
      result.rows.map((item) => [item.tree_id, +item.adopted, +item.watered]),
    );
  } catch (error) {
    console.error(error);

    res.json({
      error: error,
    });
  }
};
