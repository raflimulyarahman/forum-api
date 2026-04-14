
const jwt = require('jsonwebtoken');
const JwtTokenManager = require('../JwtTokenManager');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('JwtTokenManager', () => {
  describe('createAccessToken', () => {
    it('should create accessToken correctly', async () => {
      const payload = { username: 'dicoding', id: 'user-123' };
      const jwtTokenManager = new JwtTokenManager(jwt);

      const accessToken = await jwtTokenManager.createAccessToken(payload);

      expect(typeof accessToken).toEqual('string');
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
      expect(decoded.username).toEqual(payload.username);
      expect(decoded.id).toEqual(payload.id);
    });
  });

  describe('createRefreshToken', () => {
    it('should create refreshToken correctly', async () => {
      const payload = { username: 'dicoding', id: 'user-123' };
      const jwtTokenManager = new JwtTokenManager(jwt);

      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      expect(typeof refreshToken).toEqual('string');
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
      expect(decoded.username).toEqual(payload.username);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should throw InvariantError when verification failed', async () => {
      const jwtTokenManager = new JwtTokenManager(jwt);
      await expect(jwtTokenManager.verifyRefreshToken('invalid_token'))
        .rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when refresh token verified', async () => {
      const jwtTokenManager = new JwtTokenManager(jwt);
      const refreshToken = await jwtTokenManager.createRefreshToken({ username: 'dicoding', id: 'user-123' });
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken))
        .resolves.not.toThrow(InvariantError);
    });
  });

  describe('decodePayload', () => {
    it('should decode payload correctly', async () => {
      const jwtTokenManager = new JwtTokenManager(jwt);
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding', id: 'user-123' });
      const decoded = await jwtTokenManager.decodePayload(accessToken);
      expect(decoded.username).toEqual('dicoding');
      expect(decoded.id).toEqual('user-123');
    });
  });
});
