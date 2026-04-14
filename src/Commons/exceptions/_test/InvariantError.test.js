
const InvariantError = require('../InvariantError');

describe('InvariantError', () => {
  it('should create InvariantError correctly', () => {
    const error = new InvariantError('invariant error');
    expect(error.statusCode).toEqual(400);
    expect(error.message).toEqual('invariant error');
    expect(error.name).toEqual('InvariantError');
  });
});
