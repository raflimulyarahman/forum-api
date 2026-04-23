const DomainErrorTranslator = require('../DomainErrorTranslator');

describe('DomainErrorTranslator', () => {
  describe('REGISTER_USER errors', () => {
    it('should translate NOT_CONTAIN_NEEDED_PROPERTY correctly', () => {
      const errorCode = 'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY';
      const translation = DomainErrorTranslator.translate(errorCode);
      expect(translation).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
    });

    it('should translate NOT_MEET_DATA_TYPE_SPECIFICATION correctly', () => {
      const errorCode = 'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION';
      const translation = DomainErrorTranslator.translate(errorCode);
      expect(translation).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai');
    });

    it('should translate USERNAME_LIMIT_CHAR correctly', () => {
      const errorCode = 'REGISTER_USER.USERNAME_LIMIT_CHAR';
      const translation = DomainErrorTranslator.translate(errorCode);
      expect(translation).toEqual('tidak dapat membuat user baru karena karakter username melebihi batas limit');
    });

    it('should translate USERNAME_CONTAIN_RESTRICTED_CHARACTER correctly', () => {
      const errorCode = 'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER';
      const translation = DomainErrorTranslator.translate(errorCode);
      expect(translation).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang');
    });
  });

  describe('USER_LOGIN errors', () => {
    it('should translate NOT_CONTAIN_NEEDED_PROPERTY correctly', () => {
      const errorCode = 'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY';
      const translation = DomainErrorTranslator.translate(errorCode);
      expect(translation).toEqual('harus mengirimkan username dan password');
    });

    it('should translate NOT_MEET_DATA_TYPE_SPECIFICATION correctly', () => {
      const errorCode = 'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION';
      const translation = DomainErrorTranslator.translate(errorCode);
      expect(translation).toEqual('username dan password harus string');
    });
  });

  describe('NEW_THREAD errors', () => {
    it('should translate NOT_CONTAIN_NEEDED_PROPERTY correctly', () => {
      const translation = DomainErrorTranslator.translate('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      expect(translation).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should translate NOT_MEET_DATA_TYPE_SPECIFICATION correctly', () => {
      const translation = DomainErrorTranslator.translate('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
      expect(translation).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });

    it('should translate TITLE_LIMIT_CHAR correctly', () => {
      const translation = DomainErrorTranslator.translate('NEW_THREAD.TITLE_LIMIT_CHAR');
      expect(translation).toEqual('tidak dapat membuat thread baru karena karakter title melebihi batas limit');
    });
  });

  describe('NEW_COMMENT errors', () => {
    it('should translate NOT_CONTAIN_NEEDED_PROPERTY correctly', () => {
      const translation = DomainErrorTranslator.translate('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
      expect(translation).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should translate NOT_MEET_DATA_TYPE_SPECIFICATION correctly', () => {
      const translation = DomainErrorTranslator.translate('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
      expect(translation).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    });
  });

  describe('NEW_REPLY errors', () => {
    it('should translate NOT_CONTAIN_NEEDED_PROPERTY correctly', () => {
      const translation = DomainErrorTranslator.translate('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
      expect(translation).toEqual('tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada');
    });

    it('should translate NOT_MEET_DATA_TYPE_SPECIFICATION correctly', () => {
      const translation = DomainErrorTranslator.translate('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
      expect(translation).toEqual('tidak dapat membuat reply baru karena tipe data tidak sesuai');
    });
  });

  describe('REFRESH_AUTHENTICATION_USE_CASE errors', () => {
    it('should translate NOT_CONTAIN_REFRESH_TOKEN correctly', () => {
      const translation = DomainErrorTranslator.translate('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
      expect(translation).toEqual('harus mengirimkan token refresh');
    });

    it('should translate PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION correctly', () => {
      const translation = DomainErrorTranslator.translate('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
      expect(translation).toEqual('refresh token harus string');
    });
  });

  describe('DELETE_AUTHENTICATION_USE_CASE errors', () => {
    it('should translate NOT_CONTAIN_REFRESH_TOKEN correctly', () => {
      const translation = DomainErrorTranslator.translate('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
      expect(translation).toEqual('harus mengirimkan token refresh');
    });

    it('should translate PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION correctly', () => {
      const translation = DomainErrorTranslator.translate('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
      expect(translation).toEqual('refresh token harus string');
    });
  });

  describe('Fallback behavior', () => {
    it('should return original code for unknown error', () => {
      const unknownError = 'UNKNOWN_ERROR.SOME_CODE';
      const translation = DomainErrorTranslator.translate(unknownError);
      expect(translation).toEqual(unknownError);
    });
  });

  describe('isTranslatableError', () => {
    it('should return true for translatable REGISTER_USER errors', () => {
      expect(DomainErrorTranslator.isTranslatableError('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')).toBe(true);
      expect(DomainErrorTranslator.isTranslatableError('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')).toBe(true);
    });

    it('should return true for translatable USER_LOGIN errors', () => {
      expect(DomainErrorTranslator.isTranslatableError('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY')).toBe(true);
      expect(DomainErrorTranslator.isTranslatableError('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION')).toBe(true);
    });

    it('should return true for translatable NEW_THREAD errors', () => {
      expect(DomainErrorTranslator.isTranslatableError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')).toBe(true);
    });

    it('should return true for translatable auth use case errors', () => {
      expect(DomainErrorTranslator.isTranslatableError('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')).toBe(true);
      expect(DomainErrorTranslator.isTranslatableError('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')).toBe(true);
    });

    it('should return false for unknown errors', () => {
      expect(DomainErrorTranslator.isTranslatableError('UNKNOWN_ERROR.CODE')).toBe(false);
    });
  });
});
