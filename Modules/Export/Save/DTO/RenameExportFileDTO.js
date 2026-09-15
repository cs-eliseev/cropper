class RenameExportFileDTO {
  /** @param {string} file_name @param {boolean} is_manual правка человеком */
  constructor(file_name, is_manual) {
    this.file_name = file_name;
    this.is_manual = is_manual;
    Object.freeze(this);
  }
}
