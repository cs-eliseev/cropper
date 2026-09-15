/* Чем закончилась загрузка словаря: какой код подключён и удалось ли его
   запомнить до следующего запуска. */

class ImportedLanguageDTO {
  /** @param {string} code @param {boolean} is_stored */
  constructor(code, is_stored) {
    this.code = code;
    this.is_stored = is_stored;
    Object.freeze(this);
  }
}
