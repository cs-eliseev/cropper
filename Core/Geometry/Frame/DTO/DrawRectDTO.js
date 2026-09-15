/* Куда и какого размера класть картинку на холст, в единицах холста. */

class DrawRectDTO {
  /** @param {number} x @param {number} y @param {number} width @param {number} height */
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    Object.freeze(this);
  }
}
