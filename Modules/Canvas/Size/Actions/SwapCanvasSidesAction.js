/* Поменять стороны местами: вертикаль ↔ горизонталь. */

class SwapCanvasSidesAction {
  #canvas;
  #store;
  #events;

  /** @param {CanvasRepositoryInterface} canvas @param {StoreCanvasSizeInteractor} store @param {EventBus} events */
  constructor(canvas, store, events) {
    this.#canvas = canvas;
    this.#store = store;
    this.#events = events;
  }

  /** @returns {CanvasSizeDTO} */
  run() {
    const result = this.#store.execute(this.#canvas.getSize().swap(), null);
    this.#events.publish(new CanvasResizedEvent(result.width, result.height, result.preset_id));
    return result;
  }
}
