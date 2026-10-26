/* Рамку обрезки открыли, подвинули или убрали. Координаты — в пикселях холста. */

class CropAreaChangedEvent {
  /**
   * @param {boolean} is_active
   * @param {number} x @param {number} y @param {number} width @param {number} height
   */
  constructor(is_active, x, y, width, height) {
    this.is_active = is_active;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.occurred_at = new Date().toISOString();
    Object.freeze(this);
  }
}
