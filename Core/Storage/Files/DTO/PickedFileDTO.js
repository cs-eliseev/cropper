/* Файл, выбранный пользователем на диске: имя, тип и содержимое.
   Текст заполняется для текстовых файлов, blob — всегда. */

class PickedFileDTO {
  /** @param {string} name @param {string} type @param {Blob} blob @param {string|null} [text] */
  constructor(name, type, blob, text = null) {
    this.name = name;
    this.type = type;
    this.blob = blob;
    this.text = text;
    Object.freeze(this);
  }

  /** @param {string} extension @returns {boolean} */
  hasExtension(extension) {
    return this.name.toLowerCase().endsWith('.' + extension.toLowerCase());
  }
}
