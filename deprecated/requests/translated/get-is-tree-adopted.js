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
      SELECT *
      FROM trees_adopted
      WHERE trees_adopted.uuid = $1 AND trees_adopted.tree_id = $2
      `,
      [uuid, treeid],
    );
    res.json(result.rows.length > 0);
  } catch (error) {
    console.error(error);
    res.json({
      error: error,
    });
  }
};
