/* Приближение — сколько пикселей холста приходится на пиксель картинки:
   1 — пиксель в пиксель. Не зависит от размера холста, поэтому смена холста
   не меняет масштаб картинки. */

class ZoomVO {
  #value;

  /** @param {number} value */
  constructor(value) {
    if (!isFinite(value) || value < GeometryDictionary.MIN_ZOOM || value > GeometryDictionary.MAX_ZOOM) {
      throw new InvalidZoomException(value);
    }
    /* значащие цифры, а не знаки после запятой: мелкие масштабы тоже различимы */
    this.#value = Number(value.toPrecision(6));
    Object.freeze(this);
  }

  /** @param {number} value @returns {ZoomVO} приближение, подтянутое к границам */
  static clamped(value) {
    const v = isFinite(value) ? value : GeometryDictionary.ACTUAL_ZOOM;
    return new ZoomVO(Math.min(GeometryDictionary.MAX_ZOOM, Math.max(GeometryDictionary.MIN_ZOOM, v)));
  }

  /** @returns {ZoomVO} пиксель в пиксель */
  static actual() { return new ZoomVO(GeometryDictionary.ACTUAL_ZOOM); }

  getValue() { return this.#value; }
  getPercent() { return Math.round(this.#value * 100); }
  isActual() { return this.#value === GeometryDictionary.ACTUAL_ZOOM; }

  /** @param {number} factor @returns {ZoomVO} */
  scaledBy(factor) { return ZoomVO.clamped(this.#value * factor); }

  /** @param {ZoomVO} other */
  equals(other) { return this.#value === other.getValue(); }

  toString() { return this.getPercent() + '%'; }
}
