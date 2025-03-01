// const BAD_REQUEST_CODE = 400;
// const NOT_FOUND_CODE = 404;
// const INTERNAL_SERVICE_ERROR_CODE = 500;
// const UNAUTHORIZED_CODE = 401;
// const FORBIDDEN_CODE = 403;
// const CONFLICT_CODE = 409;

class NOT_FOUND_CODE extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class UNAUTHORIZED_CODE extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class FORBIDDEN_CODE extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class CONFLICT_CODE extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

class BAD_REQUEST_CODE extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class INTERNAL_SERVICE_ERROR_CODE extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = {
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  INTERNAL_SERVICE_ERROR_CODE,
  UNAUTHORIZED_CODE,
  FORBIDDEN_CODE,
  CONFLICT_CODE,
};
