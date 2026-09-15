/* Размер изменился — обновить свои поля и подписи. */

class OnCanvasResizedRenderSizeListener {
  #view;

  /** @param {CanvasSizeView} view */
  constructor(view) {
    this.#view = view;
  }

  /** @param {CanvasResizedEvent} event */
  handle(event) { this.#view.render(); }
}
