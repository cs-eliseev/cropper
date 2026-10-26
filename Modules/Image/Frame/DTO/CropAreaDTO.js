/* Рамка обрезки для отрисовки и жестов: положение — доли сторон холста,
   размер результата — в пикселях холста. */

class CropAreaDTO {
  /**
   * @param {boolean} is_active идёт ли обрезка
   * @param {number} x @param {number} y @param {number} width @param {number} height доли холста
   * @param {number} pixel_width @param {number} pixel_height каким станет холст
   */
  constructor(is_active, x, y, width, height, pixel_width, pixel_height) {
    this.is_active = is_active;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.pixel_width = pixel_width;
    this.pixel_height = pixel_height;
    Object.freeze(this);
  }
}
