const DomainErrorTranslator = require('../DomainErrorTranslator');

describe('DomainErrorTranslator', () => {
  describe('REGISTER_USER errors', () => {
    it('should translate NOT_CONTAIN_NEEDED_PROPERTY correctly', () => {
      const errorCode = 'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY';
      const translation = DomainErrorTranslator.translate(errorCode);
      expect(translation).toEqual('pendaftaran user baru gagal karena properti yang dibutuhkan tidak ada');
    });

    it('should translate NOT_MEET_DATA_TYPE_SPECIFICATION correctly', () => {
      const errorCode = 'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION';
      const translation = DomainErrorTranslator.translate(errorCode);
      expect(translation).toEqual('pendaftaran user baru gagal karena tipe data tidak sesuai spesifikasi');
    });

    it('should translate USERNAME_LIMIT_CHAR correctly', () => {
      const errorCode = 'REGISTER_USER.USERNAME_LIMIT_CHAR';
      const translation = DomainErrorTranslator.translate(errorCode);
      expect(translation).toEqual('pendaftaran user baru gagal karena username melebihi batas 50 karakter');
    });

    it('should translate USERNAME_CONTAIN_RESTRICTED_CHARACTER correctly', () => {
      const errorCode = 'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER';
      const translation = DomainErrorTranslator.translate(errorCode);
      expect(translation).toEqual('pendaftaran user baru gagal karena username mengandung karakter terlarang');
    });
  });

  describe('USER_LOGIN errors', () => {
    it('should translate NOT_CONTAIN_NEEDED_PROPERTY correctly', () => {
      const errorCode = 'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY';
      const translation = DomainErrorTranslator.translate(errorCode);
      expect(translation).toEqual('login gagal karena properti yang dibutuhkan tidak ada');
    });

    it('should translate NOT_MEET_DATA_TYPE_SPECIFICATION correctly', () => {
      const errorCode = 'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION';
      const translation = DomainErrorTranslator.translate(errorCode);
      expect(translation).toEqual('login gagal karena tipe data tidak sesuai spesifikasi');
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

    it('should return false for unknown errors', () => {
      expect(DomainErrorTranslator.isTranslatableError('UNKNOWN_ERROR.CODE')).toBe(false);
      expect(DomainErrorTranslator.isTranslatableError('NEW_THREAD.TITLE_LIMIT_CHAR')).toBe(false);
    });
  });
});
