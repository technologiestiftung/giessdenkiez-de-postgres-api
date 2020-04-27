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
    const { tree_id, uuid } = req.query;

    const result = await pool.query(`
      INSERT INTO trees_adopted (tree_id, uuid)
      VALUES ($1, $2);
    `, [tree_id, uuid]);
    res.json({
        "result": 'tree adopted '
    });
  } catch (error) {
    console.error(error);
    res.json({
        "error": error
    });
  }
}