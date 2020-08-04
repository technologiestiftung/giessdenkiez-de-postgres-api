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
    const result = await pool.query(`
        SELECT tree_id
        FROM trees_watered
    `);

    res.json({
      watered: result.rows.map((item) => item.tree_id),
    });
  } catch (error) {
    console.error(error);
    res.json({
      error: error,
    });
  }
};
