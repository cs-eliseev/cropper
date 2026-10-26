/* Чистая сборка имени файла по шаблону из config.js. */

class FileNameService {
  #pattern;
  #fallback_name;

  /**
   * @param {string} pattern например '{name}-{w}x{h}.{ext}'
   * @param {string} fallback_name чем заменить {name}, пока картинки нет
   */
  constructor(pattern, fallback_name) {
    this.#pattern = pattern;
    this.#fallback_name = fallback_name;
  }

  /**
   * @param {SizeVO} size @param {ExportFormatDTO} format
   * @param {string} image_name имя исходного файла; расширение отбрасывается
   * @returns {string}
   */
  build(size, format, image_name) {
    const name = image_name.replace(/\.[a-z0-9]+$/i, '').trim() || this.#fallback_name;
    return this.#pattern
      .split('{name}').join(name)
      .split('{w}').join(String(size.getWidth()))
      .split('{h}').join(String(size.getHeight()))
      .split('{ext}').join(format.extension);
  }

  /** @param {string} file_name @param {ExportFormatDTO} format @returns {string} */
  withExtension(file_name, format) {
    return file_name.replace(/\.[a-z0-9]+$/i, '.' + format.extension);
  }
}
