const pg = require('pg');

delete pg.native;

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
    const { tree_id, uuid } = req.query;
    const result = await pool.query(
      `
      DELETE FROM trees_adopted
      WHERE tree_id = $1 AND uuid = $2;
    `,
      [tree_id, uuid]
    );
    res.json({
      result: 'tree un-adopted ',
    });
  } catch (error) {
    console.error(error);

    res.json({
      error: error,
    });
  }
};
// const pg = require('pg');
// delete pg.native;

// var config = {
//   user: process.env.user,
//   database: process.env.database,
//   password: process.env.password,
//   port: process.env.port,
//   host: process.env.host
// };

// var pool = new pg.Pool(config);

// module.exports = async (req, res, next) => {
//   try {
//     const { tree_id, uuid } = req.query;

//     const result = await pool.query(`
//       DELETE FROM trees_adopted
//       WHERE tree_id = $1 AND uuid = $2;
//     `, [tree_id, uuid]);
//     res.json({
//         "result": 'tree un-adopted '
//     });
//   } catch (error) {
//     console.error(error);
//     res.json({
//         "error": error
//     });
//   }
// }
