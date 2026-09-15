/* Словарь языка: код, название для списка, направление письма и сами строки. */

class LanguageDTO {
  /**
   * @param {string} code @param {string} name
   * @param {string} dir 'ltr' или 'rtl'
   * @param {object} strings ключ → строка
   */
  constructor(code, name, dir, strings) {
    this.code = code;
    this.name = name;
    this.dir = dir === 'rtl' ? 'rtl' : 'ltr';
    this.strings = Object.freeze(Object.assign({}, strings));
    Object.freeze(this);
  }
}
