const pg = require('pg');
delete pg.native;

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
    const { id, time, uuid, amount } = req.query;

    const result = await pool.query(`
      INSERT INTO trees_watered (tree_id, time, uuid, amount)
      VALUES ($1, $2, $3, $4)
    `, [id, time, uuid, amount]);

    res.json({
        "result": 'tree watered'
    });
  } catch (error) {
    console.error(error);
    res.json({
        "error": error
    });
  }
}