class ChangeExportQualityDTO {
  /** @param {number} quality 0..1 */
  constructor(quality) {
    this.quality = quality;
    Object.freeze(this);
  }
}
