// const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require("../utils/config");

const { INTERNAL_SERVICE_ERROR_CODE } = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || INTERNAL_SERVICE_ERROR_CODE;

  const message =
    statusCode === INTERNAL_SERVICE_ERROR_CODE
      ? "An error has occurred on the server."
      : err.message;
  res.status(statusCode).send({ message });
  next();
};

module.exports = { errorHandler };
