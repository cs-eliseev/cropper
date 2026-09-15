/* Куда рисовать кадр. context — примитив браузера, аналог потока вывода:
   модуль пишет в него пиксели и ничего о вызывающем не знает. */

class RenderFrameDTO {
  /**
   * @param {CanvasRenderingContext2D} context
   * @param {number} width ширина цели в пикселях
   * @param {number} height высота цели в пикселях
   * @param {string|null} matte чем залить поля; null — оставить прозрачными
   */
  constructor(context, width, height, matte) {
    this.context = context;
    this.width = width;
    this.height = height;
    this.matte = matte;
    Object.freeze(this);
  }
}
