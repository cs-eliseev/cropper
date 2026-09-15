/* Файл словаря не читается или не той формы. */

class LanguageFileException extends PreferencesException {
  /** @param {string} file_name @param {string} reason */
  constructor(file_name, reason) {
    super('Language file is not readable');
    this.file_name = file_name;
    this.reason = reason;
    Object.freeze(this);
  }

  getDetails() { return { file_name: this.file_name, reason: this.reason }; }
}
