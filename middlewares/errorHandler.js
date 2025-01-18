// const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  INTERNAL_SERVICE_ERROR_CODE,
  UNAUTHORIZED_CODE,
  FORBIDDEN_CODE,
  CONFLICT_CODE,
} = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  // const { authorization } = req.headers;
  // if (!authorization || !authorization.startsWith("Bearer ")) {
  //   return res
  //     .status(UNAUTHORIZED_CODE)
  //     .send({ message: "Authorization required" });
  // }
  // const token = authorization.replace("Bearer ", "");
  // let payload;
  // try {
  //   // trying to verify the token
  //   payload = jwt.verify(token, JWT_SECRET);
  // } catch (err) {
  //   return res
  //     .status(UNAUTHORIZED_CODE)
  //     .send({ message: "Authorization required" });
  // }
  // req.user = payload;
  // return next();
};

module.exports = { errorHandler };
