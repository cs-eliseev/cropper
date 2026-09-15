/* Текущий размер холста — операция публичной поверхности модуля. */

/** @implements {GetCanvasSizeInterface} */
class GetCanvasSizeAction {
  #canvas;

  /** @param {CanvasRepositoryInterface} canvas */
  constructor(canvas) {
    this.#canvas = canvas;
  }

  /** @returns {CanvasSizeDTO} */
  run() {
    const size = this.#canvas.getSize();
    return new CanvasSizeDTO(size.getWidth(), size.getHeight(), this.#canvas.findPresetId());
  }
}
