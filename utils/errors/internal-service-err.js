class INTERNAL_SERVICE_ERROR_CODE extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = {
  INTERNAL_SERVICE_ERROR_CODE,
};
