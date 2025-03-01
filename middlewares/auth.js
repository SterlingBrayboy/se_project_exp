const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const { UNAUTHORIZED_CODE } = require("../utils/errors/unauthorized-err");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UNAUTHORIZED_CODE("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    // trying to verify the token
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UNAUTHORIZED_CODE("Invalid token"));
  }
  req.user = payload;
  next();
};

module.exports = { auth };
