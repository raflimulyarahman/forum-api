
const LoginUserUseCase = require('../LoginUserUseCase');
const NewAuth = require('../../../Domains/authentications/entities/NewAuth');

describe('LoginUserUseCase', () => {
  it('should orchestrating the login action correctly', async () => {
    // Arrange
    const useCasePayload = { username: 'dicoding', password: 'secret' };

    const mockUserRepository = {};
    const mockAuthenticationRepository = {};
    const mockAuthenticationTokenManager = {};
    const mockPasswordHash = {};

    mockUserRepository.getPasswordByUsername = vi.fn(() => Promise.resolve('encrypted_password'));
    mockUserRepository.getIdByUsername = vi.fn(() => Promise.resolve('user-123'));
    mockPasswordHash.comparePassword = vi.fn(() => Promise.resolve());
    mockAuthenticationTokenManager.createAccessToken = vi.fn(() => Promise.resolve('access_token'));
    mockAuthenticationTokenManager.createRefreshToken = vi.fn(() => Promise.resolve('refresh_token'));
    mockAuthenticationRepository.addToken = vi.fn(() => Promise.resolve());

    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(actualAuthentication).toEqual(new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    }));
    expect(mockUserRepository.getPasswordByUsername).toBeCalledWith('dicoding');
    expect(mockPasswordHash.comparePassword).toBeCalledWith('secret', 'encrypted_password');
    expect(mockUserRepository.getIdByUsername).toBeCalledWith('dicoding');
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(mockAuthenticationRepository.addToken).toBeCalledWith('refresh_token');
  });
});
