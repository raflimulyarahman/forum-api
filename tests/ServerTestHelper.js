/* istanbul ignore file */
const jwt = require('jsonwebtoken');

const ServerTestHelper = {
  getAccessToken({ id = 'user-123', username = 'dicoding' } = {}) {
    return jwt.sign({ id, username }, process.env.ACCESS_TOKEN_KEY);
  },
};

module.exports = ServerTestHelper;
