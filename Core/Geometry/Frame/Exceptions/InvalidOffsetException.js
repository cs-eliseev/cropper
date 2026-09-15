class InvalidOffsetException extends GeometryException {
  /** @param {number} x @param {number} y */
  constructor(x, y) {
    super('Offset out of bounds');
    this.x = x;
    this.y = y;
    Object.freeze(this);
  }

  getDetails() { return { x: this.x, y: this.y }; }
}
