/* Тема: либо ссылка на файл рядом со страницей, либо готовый css-текст. */

class ThemeDTO {
  /** @param {string} id @param {string} name @param {string|null} href @param {string|null} css */
  constructor(id, name, href = null, css = null) {
    this.id = id;
    this.name = name;
    this.href = href;
    this.css = css;
    Object.freeze(this);
  }

  /** @returns {boolean} тема-файл ложится поверх базовой, а не заменяет её */
  isOverlay() { return this.css !== null; }
}
