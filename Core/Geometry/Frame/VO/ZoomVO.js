/* Приближение: 1 — картинка заполняет холст целиком, меньше — с полями. */

class ZoomVO {
  #value;

  /** @param {number} value */
  constructor(value) {
    if (!isFinite(value) || value < GeometryDictionary.MIN_ZOOM || value > GeometryDictionary.MAX_ZOOM) {
      throw new InvalidZoomException(value);
    }
    this.#value = Math.round(value * 1000) / 1000;
    Object.freeze(this);
  }

  /** @param {number} value @returns {ZoomVO} приближение, подтянутое к границам */
  static clamped(value) {
    const v = isFinite(value) ? value : GeometryDictionary.FILL_ZOOM;
    return new ZoomVO(Math.min(GeometryDictionary.MAX_ZOOM, Math.max(GeometryDictionary.MIN_ZOOM, v)));
  }

  /** @returns {ZoomVO} */
  static fill() { return new ZoomVO(GeometryDictionary.FILL_ZOOM); }

  getValue() { return this.#value; }
  getPercent() { return Math.round(this.#value * 100); }
  isFill() { return this.#value === GeometryDictionary.FILL_ZOOM; }

  /** @param {number} factor @returns {ZoomVO} */
  scaledBy(factor) { return ZoomVO.clamped(this.#value * factor); }

  /** @param {ZoomVO} other */
  equals(other) { return this.#value === other.getValue(); }

  toString() { return this.getPercent() + '%'; }
}
