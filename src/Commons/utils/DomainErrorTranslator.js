class DomainErrorTranslator {
  static #translations = {
    'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': 'pendaftaran user baru gagal karena properti yang dibutuhkan tidak ada',
    'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': 'pendaftaran user baru gagal karena tipe data tidak sesuai spesifikasi',
    'REGISTER_USER.USERNAME_LIMIT_CHAR': 'pendaftaran user baru gagal karena username melebihi batas 50 karakter',
    'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': 'pendaftaran user baru gagal karena username mengandung karakter terlarang',
    'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': 'login gagal karena properti yang dibutuhkan tidak ada',
    'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': 'login gagal karena tipe data tidak sesuai spesifikasi',
  };

  static translate(errorCode) {
    return this.#translations[errorCode] || errorCode;
  }

  static isTranslatableError(errorCode) {
    return errorCode in this.#translations;
  }
}

module.exports = DomainErrorTranslator;
