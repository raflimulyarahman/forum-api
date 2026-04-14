
const pool = require('../../database/postgres/pool');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('AuthenticationRepositoryPostgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addToken function', () => {
    it('should add token to database', async () => {
      const authRepo = new AuthenticationRepositoryPostgres(pool);
      const token = 'token';

      await authRepo.addToken(token);

      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(1);
      expect(tokens[0].token).toBe(token);
    });
  });

  describe('checkAvailabilityToken function', () => {
    it('should throw InvariantError if token not available', async () => {
      const authRepo = new AuthenticationRepositoryPostgres(pool);
      await expect(authRepo.checkAvailabilityToken('token')).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError if token available', async () => {
      const authRepo = new AuthenticationRepositoryPostgres(pool);
      await AuthenticationsTableTestHelper.addToken('token');
      await expect(authRepo.checkAvailabilityToken('token')).resolves.not.toThrow(InvariantError);
    });
  });

  describe('deleteToken function', () => {
    it('should delete token from database', async () => {
      const authRepo = new AuthenticationRepositoryPostgres(pool);
      await AuthenticationsTableTestHelper.addToken('token');

      await authRepo.deleteToken('token');

      const tokens = await AuthenticationsTableTestHelper.findToken('token');
      expect(tokens).toHaveLength(0);
    });
  });
});
