
const LogoutUserUseCase = require('../LogoutUserUseCase');

describe('LogoutUserUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    const useCase = new LogoutUserUseCase({ authenticationRepository: {} });
    await expect(useCase.execute({})).rejects.toThrowError('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
  });

  it('should throw error if refresh token not string', async () => {
    const useCase = new LogoutUserUseCase({ authenticationRepository: {} });
    await expect(useCase.execute({ refreshToken: 123 })).rejects.toThrowError('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the logout action correctly', async () => {
    const useCasePayload = { refreshToken: 'refresh_token' };
    const mockAuthenticationRepository = {};
    mockAuthenticationRepository.checkAvailabilityToken = vi.fn(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = vi.fn(() => Promise.resolve());

    const useCase = new LogoutUserUseCase({ authenticationRepository: mockAuthenticationRepository });
    await useCase.execute(useCasePayload);

    expect(mockAuthenticationRepository.checkAvailabilityToken).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(useCasePayload.refreshToken);
  });
});
