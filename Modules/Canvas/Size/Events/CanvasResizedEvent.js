/* Размер холста изменён. Несёт только примитивы и время факта. */

class CanvasResizedEvent {
  /** @param {number} width @param {number} height @param {string|null} preset_id */
  constructor(width, height, preset_id) {
    this.width = width;
    this.height = height;
    this.preset_id = preset_id;
    this.occurred_at = new Date().toISOString();
    Object.freeze(this);
  }
}
