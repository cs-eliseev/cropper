/* Положение картинки в холсте, 0..1 по каждой оси — как background-position в процентах. */

class OffsetVO {
  #x;
  #y;

  /** @param {number} x @param {number} y */
  constructor(x, y) {
    if (!isFinite(x) || !isFinite(y) || x < 0 || x > 1 || y < 0 || y > 1) {
      throw new InvalidOffsetException(x, y);
    }
    this.#x = x;
    this.#y = y;
    Object.freeze(this);
  }

  /** @param {number} x @param {number} y @returns {OffsetVO} положение, подтянутое к границам */
  static clamped(x, y) {
    const fit = v => Math.min(1, Math.max(0, isFinite(v) ? v : 0.5));
    return new OffsetVO(fit(x), fit(y));
  }

  /** @returns {OffsetVO} */
  static centered() { return new OffsetVO(0.5, 0.5); }

  getX() { return this.#x; }
  getY() { return this.#y; }
  isCentered() { return this.#x === 0.5 && this.#y === 0.5; }

  /** @param {OffsetVO} other */
  equals(other) { return this.#x === other.getX() && this.#y === other.getY(); }

  toString() { return this.#x.toFixed(2) + ':' + this.#y.toFixed(2); }
}
