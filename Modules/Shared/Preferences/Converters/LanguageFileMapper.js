/* Файл словаря → LanguageDTO. Понимает две записи одного и того же:
   .json с объектом и .js с вызовом App.lang({...}).
   Только преобразование, без решений. */

class LanguageFileMapper {
  /**
   * @param {PickedFileDTO} file
   * @returns {LanguageDTO} @throws {LanguageFileException}
   */
  toLanguage(file) {
    const raw = file.hasExtension('js') ? this.#fromScript(file) : this.#fromJson(file);
    if (!raw || !raw.code || !raw.strings) throw new LanguageFileException(file.name, 'code and strings required');
    return new LanguageDTO(raw.code, raw.name || raw.code, raw.dir, raw.strings);
  }

  /** @param {PickedFileDTO} file */
  #fromJson(file) {
    try {
      return JSON.parse(String(file.text));
    } catch (error) {
      throw new LanguageFileException(file.name, error.message);
    }
  }

  /* Файл .js — это вызов App.lang(объект); выполняем его и ловим аргумент.
     Файл лежит на машине пользователя и ничем не отличается от словаря,
     подключённого тегом script. */
  #fromScript(file) {
    let captured = null;
    const sink = { lang: definition => { captured = definition; } };
    try {
      new Function('App', String(file.text))(sink);
    } catch (error) {
      throw new LanguageFileException(file.name, error.message);
    }
    return captured;
  }
}
