/* Хватает ли оригинала на заданный размер. */

class QualityEstimateDTO {
  /**
   * @param {boolean} is_enough @param {number} source_px сколько пикселей оригинала в кадре
   * @param {number} target_px сколько нужно @param {number} upscale во сколько раз тянем
   */
  constructor(is_enough, source_px, target_px, upscale) {
    this.is_enough = is_enough;
    this.source_px = source_px;
    this.target_px = target_px;
    this.upscale = upscale;
    Object.freeze(this);
  }
}
