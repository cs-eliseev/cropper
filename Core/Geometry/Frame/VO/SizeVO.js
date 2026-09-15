/* Размер в пикселях. Неверного размера не существует: проверка в конструкторе. */

class SizeVO {
  #width;
  #height;

  /** @param {number} width @param {number} height */
  constructor(width, height) {
    const w = Math.round(width);
    const h = Math.round(height);
    const min = GeometryDictionary.MIN_SIDE;
    const max = GeometryDictionary.MAX_SIDE;
    if (!isFinite(w) || !isFinite(h) || w < min || h < min || w > max || h > max) {
      throw new InvalidSizeException(width, height);
    }
    this.#width = w;
    this.#height = h;
    Object.freeze(this);
  }

  /** @param {number} width @param {number} height @returns {SizeVO} размер, подтянутый к границам */
  static clamped(width, height) {
    const min = GeometryDictionary.MIN_SIDE;
    const max = GeometryDictionary.MAX_SIDE;
    const fit = v => Math.min(max, Math.max(min, Math.round(isFinite(v) ? v : min)));
    return new SizeVO(fit(width), fit(height));
  }

  getWidth() { return this.#width; }
  getHeight() { return this.#height; }
  getRatio() { return this.#width / this.#height; }
  isLandscape() { return this.#width > this.#height; }
  getLongSide() { return Math.max(this.#width, this.#height); }

  /** @returns {SizeVO} новый размер со сторонами наоборот */
  swap() { return new SizeVO(this.#height, this.#width); }

  /** @param {SizeVO} other */
  equals(other) { return this.#width === other.getWidth() && this.#height === other.getHeight(); }

  toString() { return this.#width + '×' + this.#height; }
}
