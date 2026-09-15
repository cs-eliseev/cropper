class ImageLoadedEvent {
  /** @param {string} name @param {number} width @param {number} height */
  constructor(name, width, height) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.occurred_at = new Date().toISOString();
    Object.freeze(this);
  }
}
