/* Внутренний порт: где лежат словари и какой выбран. */

/** @interface */
class LanguageRepositoryInterface {
  /** @returns {LanguageDTO[]} */
  listLanguages() { throw new Error('not implemented'); }
  /** @returns {LanguageDTO} */
  getCurrent() { throw new Error('not implemented'); }
  /** @param {string} code @returns {LanguageDTO|null} */
  findByCode(code) { throw new Error('not implemented'); }
  /** @param {string} code */
  setCurrent(code) { throw new Error('not implemented'); }
  /** @param {LanguageDTO} language @returns {boolean} */
  saveCustom(language) { throw new Error('not implemented'); }
}

/** @type {symbol} */
const LanguageRepositoryToken = Symbol('LanguageRepositoryInterface');
