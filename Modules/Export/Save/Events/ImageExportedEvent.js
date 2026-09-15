class ImageExportedEvent {
  /** @param {string} file_name @param {number} width @param {number} height @param {number} bytes */
  constructor(file_name, width, height, bytes) {
    this.file_name = file_name;
    this.width = width;
    this.height = height;
    this.bytes = bytes;
    this.occurred_at = new Date().toISOString();
    Object.freeze(this);
  }
}
