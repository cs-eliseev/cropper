/* Задать произвольный размер холста. Значение вне границ подтягивается,
   а не роняет операцию: это ввод человека, а не сбой. */

/** @implements {ResizeCanvasInterface} */
class ResizeCanvasAction {
  #store;
  #events;

  /** @param {StoreCanvasSizeInteractor} store @param {EventBus} events */
  constructor(store, events) {
    this.#store = store;
    this.#events = events;
  }

  /** @param {ResizeCanvasDTO} dto @returns {CanvasSizeDTO} */
  run(dto) {
    const size = SizeVO.clamped(dto.width, dto.height);
    const result = this.#store.execute(size, null);
    this.#events.publish(new CanvasResizedEvent(result.width, result.height, result.preset_id));
    return result;
  }
}
