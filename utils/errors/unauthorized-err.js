class UNAUTHORIZED_CODE extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = {
  UNAUTHORIZED_CODE,
};
