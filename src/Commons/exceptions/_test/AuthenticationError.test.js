
const AuthenticationError = require('../AuthenticationError');

describe('AuthenticationError', () => {
  it('should create AuthenticationError correctly', () => {
    const error = new AuthenticationError('authentication error');
    expect(error.statusCode).toEqual(401);
    expect(error.message).toEqual('authentication error');
    expect(error.name).toEqual('AuthenticationError');
  });
});
