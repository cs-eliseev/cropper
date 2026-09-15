/* Адаптер к localStorage браузера. Единственное место, которое его знает.
   Ключи получают общий префикс, потому что file:// делит хранилище
   между всеми страницами на диске. */

/** @implements {KeyValueStorageInterface} */
class LocalStorageGateway {
  #prefix;

  /** @param {string} prefix пространство имён приложения */
  constructor(prefix) {
    this.#prefix = prefix;
  }

  /** @param {string} key @param {*} [fallback] @returns {*} */
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(this.#prefix + '.' + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  /** @param {string} key @param {*} value @returns {boolean} */
  set(key, value) {
    try {
      localStorage.setItem(this.#prefix + '.' + key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  /** @param {string} key */
  remove(key) {
    try {
      localStorage.removeItem(this.#prefix + '.' + key);
    } catch (error) {
      /* нечего убирать */
    }
  }
}
