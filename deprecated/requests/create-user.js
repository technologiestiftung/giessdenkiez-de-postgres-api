const pg = require("pg");
const uuid = require("uuid");

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
    const { mail, uuid } = req.query;
    const result = await pool.query(
      `
      INSERT INTO users (email, uuid)
      VALUES ($1, $2)
      ON CONFLICT (email)
      DO NOTHING;
    `,
      [mail, uuid],
    );
    res.json({
      result: "user added",
    });
  } catch (error) {
    console.error(error);
    res.json({
      error: error,
    });
  }
};
