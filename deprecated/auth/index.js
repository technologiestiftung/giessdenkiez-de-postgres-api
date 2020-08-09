var jwt = require("express-jwt");
var jwks = require("jwks-rsa");

var jwtCheck = params => {
  try {
    console.log("jwtCheck");
    return jwt({
      secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.jwksuri,
      }),
      audience: process.env.audience,
      issuer: process.env.issuer,
      algorithms: ['RS256'],
    })(params);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

module.exports = jwtCheck;