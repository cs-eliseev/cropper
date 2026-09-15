/* Последовательность, общая для всех действий модуля: записать размер
   и собрать ответ. Событие остаётся за действием — оно знает, что случилось. */

class StoreCanvasSizeInteractor {
  #canvas;

  /** @param {CanvasRepositoryInterface} canvas */
  constructor(canvas) {
    this.#canvas = canvas;
  }

  /** @param {SizeVO} size @param {string|null} preset_id @returns {CanvasSizeDTO} */
  execute(size, preset_id) {
    this.#canvas.update(size, preset_id);
    return new CanvasSizeDTO(size.getWidth(), size.getHeight(), preset_id);
  }
}
