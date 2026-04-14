
const ClientError = require('../ClientError');

describe('ClientError', () => {
  it('should create ClientError correctly', () => {
    const clientError = new ClientError('client error');
    expect(clientError.statusCode).toEqual(400);
    expect(clientError.message).toEqual('client error');
    expect(clientError.name).toEqual('ClientError');
  });

  it('should create ClientError with custom statusCode', () => {
    const clientError = new ClientError('not found', 404);
    expect(clientError.statusCode).toEqual(404);
    expect(clientError.message).toEqual('not found');
  });
});
