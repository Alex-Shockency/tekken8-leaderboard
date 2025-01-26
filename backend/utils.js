var { expressjwt: jwt } = require("express-jwt");
const jwks = require("jwks-rsa");

const checkJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-6qq2es4t3n3j10sm.us.auth0.com/.well-known/jwks.json`,
  }),
  audience: "https://dev-6qq2es4t3n3j10sm.us.auth0.com/api/v2/",
  issuer: `https://dev-6qq2es4t3n3j10sm.us.auth0.com/`,
  algorithms: ["RS256"],
});

module.exports = { checkJwt };
