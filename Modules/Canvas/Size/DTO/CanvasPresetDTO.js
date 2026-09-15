/* Шаблон холста из config.js. label и meta — ключи словаря либо готовый текст. */

class CanvasPresetDTO {
  /** @param {string} id @param {number} width @param {number} height @param {string} label @param {string} meta */
  constructor(id, width, height, label, meta) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.label = label;
    this.meta = meta;
    Object.freeze(this);
  }
}
