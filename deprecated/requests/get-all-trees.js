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
    const { offset, limit } = req.query;
    const result = await pool.query(
      `
      SELECT (id, lat, lng, radolan_sum)
      FROM trees
      ORDER BY id ASC
      OFFSET $1 LIMIT $2;
    `,
      [offset, limit],
    );

    res.json({
      watered: result.rows.map((item) => {
        const regExId = /(?<=\()(.*?)(?=\,)/;

        const regExLat = /(?<=\,)(.*?)(?=\,)/;

        const regExLng = /([^,]*,){2}([^,]+)./;

        const regExSum = /([^,]*,){3}([^)]+)./;

        const id = item.row.match(regExId);

        const lat = item.row.match(regExLat);

        const lng = item.row.match(regExLng);

        const sum = item.row.match(regExSum);

        if (sum) {
          return [
            id[0],
            parseFloat(lat[0]),
            parseFloat(lng[2]),
            parseFloat(sum[2]),
          ];
        } else {
          return [id[0], parseFloat(lat[0]), parseFloat(lng[2]), 0];
        }
      }),
    });
  } catch (error) {
    console.error(error);

    res.json({
      error: error,
    });
  }
};
// const pg = require('pg');

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
//     const { offset, limit } = req.query;

//     const result = await pool.query(`
//       SELECT (id, lat, lng, radolan_sum)
//       FROM trees
//       ORDER BY id ASC
//       OFFSET $1 LIMIT $2;
//     `, [offset, limit]);
//     res.json({
//         "watered": result.rows.map(item => {
//           const regExId = /(?<=\()(.*?)(?=\,)/
//           const regExLat = /(?<=\,)(.*?)(?=\,)/
//           const regExLng = /([^,]*,){2}([^,]+)./
//           const regExSum = /([^,]*,){3}([^)]+)./
//           const id = item.row.match(regExId);
//           const lat = item.row.match(regExLat);
//           const lng = item.row.match(regExLng);
//           const sum = item.row.match(regExSum);

//           if (sum) {
//             return [id[0], parseFloat(lat[0]), parseFloat(lng[2]), parseFloat(sum[2])];
//           } else {
//             return [id[0], parseFloat(lat[0]), parseFloat(lng[2]), 0];
//           }
//         })
//     });
//   } catch (error) {
//     console.error(error);
//     res.json({
//         "error": error
//     });
//   }
// }
