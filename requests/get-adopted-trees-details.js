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
    const { tree_ids } = req.query;
    console.log(tree_ids)
    const result = await pool.query(`
      SELECT * FROM trees
      WHERE id = ANY ($1);
    `, [tree_ids]);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.json({
        "error": error
    });
  }
}