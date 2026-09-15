/* Язык переключён. Факт, который уже случился: несёт только примитивы. */

class LanguageChangedEvent {
  /** @param {string} code @param {string} dir */
  constructor(code, dir) {
    this.code = code;
    this.dir = dir;
    this.occurred_at = new Date().toISOString();
    Object.freeze(this);
  }
}
