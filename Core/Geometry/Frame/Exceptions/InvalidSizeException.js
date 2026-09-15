class InvalidSizeException extends GeometryException {
  /** @param {number} width @param {number} height */
  constructor(width, height) {
    super('Size out of bounds');
    this.width = width;
    this.height = height;
    Object.freeze(this);
  }

  getDetails() { return { width: this.width, height: this.height }; }
}
