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
    const { id } = req.query;

    const result = await pool.query(`
      UPDATE trees
      SET adopted = ''
      WHERE id = $1;
    `, [id]);
    res.json({
        "result": 'tree un-adopted '
    });
  } catch (error) {
    console.error(error);
    res.json({
        "error": error
    });
  }
}