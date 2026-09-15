/* Шина событий, которая всё запоминает. Настоящую подменяем только в тестах:
   так видно, что действие опубликовало и в каком порядке. */

export class SpyEventBus {
  published = [];
  #handlers = new Map();

  subscribe(EventClass, listener) {
    if (!this.#handlers.has(EventClass)) this.#handlers.set(EventClass, []);
    this.#handlers.get(EventClass).push(listener);
    return this;
  }

  publish(event) {
    this.published.push(event);
    (this.#handlers.get(event.constructor) || []).forEach(listener => listener.handle(event));
  }

  /** @param {Function} EventClass @returns {object[]} */
  ofType(EventClass) { return this.published.filter(event => event instanceof EventClass); }

  /** @returns {object|null} последнее опубликованное событие */
  last() { return this.published[this.published.length - 1] || null; }

  clear() { this.published = []; }
}
