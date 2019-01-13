// server/config.js
module.exports = {
  AUTH0_DOMAIN: "tour-mapper.auth0.com",
  AUTH0_ISSUER: "https://tour-mapper.auth0.com",
  AUTH0_API_AUDIENCE: "https://tour-mapper.auth0.com/api/v2/", // OR?? /userinfo? Value currently unused, as it caused issues with the token
  MONGO_URI: "mongodb://dana:X93ox61qAmIa@ds237574.mlab.com:37574/mapper-dev"
};
