const pg = require('pg');

var config = {
  user: process.env.user,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port,
  host: process.env.host
};

var pool = new pg.Pool(config);

module.exports = async (req, res, next) => {
  try {
    const { id } = req.query;
    const result = await pool.query(`
      SELECT *
      FROM trees_watered
      WHERE trees_watered.tree_id = $1`
    , [id]);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.json({
        "error": error
    });
  }
}