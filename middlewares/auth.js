const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require("../utils/config");

const {
  UNAUTHORIZED_CODE,
  INTERNAL_SERVICE_ERROR_CODE,
} = require("../utils/errors");

const extractBearerToken = (header) => {
  return header.replace("Bearer ", "");
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED_CODE)
      .send({ message: "Authorization required" });
  }
  const token = extractBearerToken(authorization);

  console.log("Extracted Token:", token);
  let payload;

  try {
    // trying to verify the token
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    return res
      .status(UNAUTHORIZED_CODE)
      .send({ message: "Authorization required" });
  }
  req.user = payload;

  next();
};
