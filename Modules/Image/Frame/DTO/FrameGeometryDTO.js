/* Состояние кадра числами — публичная поверхность модуля. */

class FrameGeometryDTO {
  /**
   * @param {boolean} has_image @param {number} image_width @param {number} image_height
   * @param {number} zoom @param {number} offset_x @param {number} offset_y @param {string} image_name
   */
  constructor(has_image, image_width, image_height, zoom, offset_x, offset_y, image_name) {
    this.has_image = has_image;
    this.image_width = image_width;
    this.image_height = image_height;
    this.zoom = zoom;
    this.offset_x = offset_x;
    this.offset_y = offset_y;
    this.image_name = image_name;
    Object.freeze(this);
  }
}
