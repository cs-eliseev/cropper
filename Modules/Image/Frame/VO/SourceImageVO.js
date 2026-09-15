/* Исходная картинка: размер, имя файла и то, чем её рисовать.
   Значение неизменяемое — новая картинка создаёт новый объект. */

class SourceImageVO {
  #element;
  #size;
  #name;

  /** @param {CanvasImageSource} element @param {SizeVO} size @param {string} name */
  constructor(element, size, name) {
    this.#element = element;
    this.#size = size;
    this.#name = name;
    Object.freeze(this);
  }

  /** @returns {CanvasImageSource} источник для отрисовки */
  getElement() { return this.#element; }
  /** @returns {SizeVO} */
  getSize() { return this.#size; }
  /** @returns {string} */
  getName() { return this.#name; }

  /** @param {SourceImageVO} other */
  equals(other) { return this.#element === other.getElement(); }

  toString() { return this.#name + ' ' + this.#size.toString(); }
}
