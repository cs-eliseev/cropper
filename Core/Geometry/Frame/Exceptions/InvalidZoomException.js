class InvalidZoomException extends GeometryException {
  /** @param {number} value */
  constructor(value) {
    super('Zoom out of bounds');
    this.value = value;
    Object.freeze(this);
  }

  getDetails() { return { value: this.value }; }
}
