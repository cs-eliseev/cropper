/* Публичная поверхность: что сейчас с картинкой — числами.
   Экспорту этого хватает, чтобы оценить запас качества. */

/** @interface */
class GetFrameGeometryInterface {
  /** @returns {FrameGeometryDTO} */
  run() { throw new Error('not implemented'); }
}

/** @type {symbol} */
const GetFrameGeometryToken = Symbol('GetFrameGeometryInterface');
