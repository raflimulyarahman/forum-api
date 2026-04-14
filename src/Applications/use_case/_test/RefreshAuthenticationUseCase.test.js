
const RefreshAuthenticationUseCase = require('../RefreshAuthenticationUseCase');

describe('RefreshAuthenticationUseCase', () => {
  it('should throw error if payload not contain refresh token', async () => {
    const useCase = new RefreshAuthenticationUseCase({});
    await expect(useCase.execute({})).rejects.toThrowError('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
  });

  it('should throw error if refresh token not string', async () => {
    const useCase = new RefreshAuthenticationUseCase({});
    await expect(useCase.execute({ refreshToken: 123 })).rejects.toThrowError('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the refresh authentication action correctly', async () => {
    const useCasePayload = { refreshToken: 'some_refresh_token' };
    const mockAuthenticationRepository = {};
    const mockAuthenticationTokenManager = {};

    mockAuthenticationTokenManager.verifyRefreshToken = vi.fn(() => Promise.resolve());
    mockAuthenticationRepository.checkAvailabilityToken = vi.fn(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = vi.fn(() => Promise.resolve({ username: 'dicoding', id: 'user-123' }));
    mockAuthenticationTokenManager.createAccessToken = vi.fn(() => Promise.resolve('new_access_token'));

    const useCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    const accessToken = await useCase.execute(useCasePayload);

    expect(mockAuthenticationTokenManager.verifyRefreshToken).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.checkAvailabilityToken).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(accessToken).toEqual('new_access_token');
  });
});
