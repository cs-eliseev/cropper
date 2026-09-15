class ExportSettingsDTO {
  /** @param {string} format_id @param {number} quality @param {string} file_name */
  constructor(format_id, quality, file_name) {
    this.format_id = format_id;
    this.quality = quality;
    this.file_name = file_name;
    Object.freeze(this);
  }
}
