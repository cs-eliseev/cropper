/* Формат экспорта из config.js. */

class ExportFormatDTO {
  /**
   * @param {string} id @param {string} mime @param {string} extension
   * @param {boolean} supports_alpha умеет ли формат прозрачность
   * @param {boolean} uses_quality учитывает ли степень сжатия
   */
  constructor(id, mime, extension, supports_alpha, uses_quality) {
    this.id = id;
    this.mime = mime;
    this.extension = extension;
    this.supports_alpha = supports_alpha;
    this.uses_quality = uses_quality;
    Object.freeze(this);
  }
}
