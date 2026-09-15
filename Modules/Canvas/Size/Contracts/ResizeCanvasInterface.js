/* Публичная поверхность: задать размер холста. Этим пользуется «Кадр»,
   когда подгоняет холст под картинку. */

/** @interface */
class ResizeCanvasInterface {
  /** @param {ResizeCanvasDTO} dto @returns {CanvasSizeDTO} */
  run(dto) { throw new Error('not implemented'); }
}

/** @type {symbol} */
const ResizeCanvasToken = Symbol('ResizeCanvasInterface');
