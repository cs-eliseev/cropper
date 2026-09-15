/* Синхронная шина событий в памяти: publish(event) / subscribe(EventClass, listener).
   Слушатели вызываются после того, как Action завершил операцию. */

class EventBus {
  #handlers = new Map();

  /**
   * @param {Function} EventClass класс события
   * @param {{handle: (event: object) => void}} listener слушатель модуля
   */
  subscribe(EventClass, listener) {
    if (!this.#handlers.has(EventClass)) this.#handlers.set(EventClass, []);
    this.#handlers.get(EventClass).push(listener);
    return this;
  }

  /** @param {object} event неизменяемое событие */
  publish(event) {
    const listeners = this.#handlers.get(event.constructor) || [];
    listeners.forEach(listener => listener.handle(event));
  }
}

/** @type {symbol} */
const EventBusToken = Symbol('EventBusInterface');
