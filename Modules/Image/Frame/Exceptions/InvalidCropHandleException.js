/* Ручка рамки обрезки, которой не бывает: значение пришло из разметки. */

class InvalidCropHandleException extends FrameException {
  /** @param {string} handle */
  constructor(handle) {
    super('Unknown crop handle');
    this.handle = handle;
    Object.freeze(this);
  }

  getDetails() { return { handle: this.handle }; }
}
