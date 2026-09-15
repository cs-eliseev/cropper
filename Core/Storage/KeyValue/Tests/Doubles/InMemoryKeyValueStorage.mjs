/* Хранилище в памяти. Публикуется вместе с контрактным тестом: любой модуль
   может брать его как заглушку и быть уверен, что оно ведёт себя как настоящее. */

export class InMemoryKeyValueStorage {
  #values = new Map();
  #is_writable;

  /** @param {boolean} is_writable false — как приватный режим браузера */
  constructor(is_writable = true) {
    this.#is_writable = is_writable;
  }

  get(key, fallback) {
    return this.#values.has(key) ? JSON.parse(this.#values.get(key)) : fallback;
  }

  set(key, value) {
    if (!this.#is_writable) return false;
    this.#values.set(key, JSON.stringify(value));
    return true;
  }

  remove(key) { this.#values.delete(key); }

  /** @returns {string[]} что вообще записано — для проверок в тестах */
  keys() { return [...this.#values.keys()].sort(); }
}
