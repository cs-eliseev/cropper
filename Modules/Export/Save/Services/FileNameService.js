/* Чистая сборка имени файла по шаблону из config.js. */

class FileNameService {
  #pattern;

  /** @param {string} pattern например 'cover-{w}x{h}.{ext}' */
  constructor(pattern) {
    this.#pattern = pattern;
  }

  /** @param {SizeVO} size @param {ExportFormatDTO} format @returns {string} */
  build(size, format) {
    return this.#pattern
      .split('{w}').join(String(size.getWidth()))
      .split('{h}').join(String(size.getHeight()))
      .split('{ext}').join(format.extension);
  }

  /** @param {string} file_name @param {ExportFormatDTO} format @returns {string} */
  withExtension(file_name, format) {
    return file_name.replace(/\.[a-z0-9]+$/i, '.' + format.extension);
  }
}
