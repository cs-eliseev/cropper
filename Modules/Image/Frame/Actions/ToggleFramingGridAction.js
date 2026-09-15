/* Показать или спрятать сетку третей — вспомогательную разметку кадра. */

class ToggleFramingGridAction {
  #frame;
  #events;

  /** @param {FrameRepositoryInterface} frame @param {EventBus} events */
  constructor(frame, events) {
    this.#frame = frame;
    this.#events = events;
  }

  /** @returns {FramingGridToggledEvent} */
  run() {
    const is_visible = !this.#frame.isGridVisible();
    this.#frame.updateGrid(is_visible);
    const event = new FramingGridToggledEvent(is_visible);
    this.#events.publish(event);
    return event;
  }
}
