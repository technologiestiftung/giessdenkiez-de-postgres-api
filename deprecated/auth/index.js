var jwt = require("express-jwt");
var jwks = require("jwks-rsa");

var jwtCheck = (req, res, next) => {
  try {
    console.log("jwksuri", process.env.jwksuri);
    console.log("issuer", process.env.issuer);
    console.log("audience", process.env.audience);
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
    })(req, res, next);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

module.exports = jwtCheck;
