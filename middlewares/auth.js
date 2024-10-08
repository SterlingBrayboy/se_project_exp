const { UNAUTHORIZED_CODE } = require("../utils/errors");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res
      .status(UNAUTHORIZED_CODE)
      .send({ message: "Authorization required" });
  }
  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    // trying to verify the token
    payload = jwt.verify(token, "some-secret-key");
    req.user = payload;
    next();
  } catch (err) {
    return res
      .status(UNAUTHORIZED_CODE)
      .send({ message: "Authorization required" });
  }
};
