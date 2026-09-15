/* Публичная поверхность: текущий размер холста. Одна операция — один интерфейс. */

/** @interface */
class GetCanvasSizeInterface {
  /** @returns {CanvasSizeDTO} */
  run() { throw new Error('not implemented'); }
}

/** @type {symbol} */
const GetCanvasSizeToken = Symbol('GetCanvasSizeInterface');
