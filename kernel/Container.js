/* Контейнер зависимостей: связывает токен контракта с реализацией.
   Слой framework — ниже Core, о модулях ничего не знает. */

class Container {
  #factories = new Map();
  #instances = new Map();

  /**
   * @param {symbol} token токен контракта
   * @param {(c: Container) => object} factory собирает реализацию
   */
  set(token, factory) {
    this.#factories.set(token, factory);
    return this;
  }

  /**
   * @param {symbol} token
   * @returns {object} единственный экземпляр реализации
   */
  get(token) {
    if (this.#instances.has(token)) return this.#instances.get(token);
    const factory = this.#factories.get(token);
    if (!factory) throw new Error('nothing bound to ' + String(token));
    const instance = factory(this);
    this.#instances.set(token, instance);
    return instance;
  }

  /** @param {symbol} token */
  has(token) { return this.#factories.has(token); }
}
