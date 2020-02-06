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
    const result = await pool.query(`
        SELECT id
        FROM trees
        WHERE length(watered) > 0;
    `);

    res.json({
        "watered": result.rows.map(item => item.id)
    });
  } catch (error) {
    console.error(error);
    res.json({
        "error": error
    });
  }
}