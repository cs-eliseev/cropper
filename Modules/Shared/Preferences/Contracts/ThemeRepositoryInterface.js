/* Внутренний порт: список тем, выбранная и базовая. */

/** @interface */
class ThemeRepositoryInterface {
  /** @returns {ThemeDTO[]} */
  listThemes() { throw new Error('not implemented'); }
  /** @returns {ThemeDTO} */
  getCurrent() { throw new Error('not implemented'); }
  /** @returns {ThemeDTO} */
  getBase() { throw new Error('not implemented'); }
  /** @param {string} id */
  setCurrent(id) { throw new Error('not implemented'); }
  /** @param {string} css @param {string} name @returns {boolean} */
  saveCustom(css, name) { throw new Error('not implemented'); }
  /** Убрать всё, что принесено файлами, и запомненный выбор. */
  clear() { throw new Error('not implemented'); }
}

/** @type {symbol} */
const ThemeRepositoryToken = Symbol('ThemeRepositoryInterface');
