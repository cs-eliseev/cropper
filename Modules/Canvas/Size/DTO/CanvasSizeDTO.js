/* Размер холста наружу: примитивы, потому что это публичная поверхность модуля. */

class CanvasSizeDTO {
  /** @param {number} width @param {number} height @param {string|null} preset_id */
  constructor(width, height, preset_id) {
    this.width = width;
    this.height = height;
    this.preset_id = preset_id;
    Object.freeze(this);
  }

  /** @returns {SizeVO} */
  toSize() { return new SizeVO(this.width, this.height); }
}
