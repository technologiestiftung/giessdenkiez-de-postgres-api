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
    const { start, end } = req.query;
    const result = await pool.query(
      `
      SELECT COUNT(*)
      FROM trees
      WHERE trees.pflanzjahr > $1
      AND trees.pflanzjahr < $2;`,
      [Number(start), Number(end)],
    );

    res.json(result);
  } catch (error) {
    console.error(error);
    res.json({
      error: error,
    });
  }
};
