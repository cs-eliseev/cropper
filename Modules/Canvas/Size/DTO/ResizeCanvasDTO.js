class ResizeCanvasDTO {
  /** @param {number} width @param {number} height */
  constructor(width, height) {
    this.width = width;
    this.height = height;
    Object.freeze(this);
  }
}
