/* Темы: объявленные в настройках плюс одна принесённая файлом.
   Помнит и выбранную тему, и базовую — свой файл ложится поверх базовой. */

/** @implements {ThemeRepositoryInterface} */
class ThemeRepository {
  #storage;
  #themes = new Map();
  #current = '';
  #base = '';

  /**
   * @param {KeyValueStorageInterface} storage
   * @param {ThemeDTO[]} declared темы из config.js
   * @param {string} preferred id темы из config.js
   * @param {string} custom_name как называть тему, принесённую файлом
   */
  constructor(storage, declared, preferred, custom_name) {
    this.#storage = storage;
    declared.forEach(theme => this.#themes.set(theme.id, theme));
    const css = this.#storage.get('custom-theme');
    if (css) this.#themes.set('custom', new ThemeDTO('custom', custom_name, null, css));

    const known = id => this.#themes.has(id);
    this.#base = [this.#storage.get('theme-base'), preferred, this.listThemes()[0].id].find(known);
    const saved = this.#storage.get('theme');
    this.#current = known(saved) ? saved : this.#base;
  }

  /** @returns {ThemeDTO[]} */
  listThemes() { return [...this.#themes.values()]; }

  /** @returns {ThemeDTO} */
  getCurrent() { return this.#themes.get(this.#current); }

  /** @returns {ThemeDTO} */
  getBase() { return this.#themes.get(this.#base); }

  /** @param {string} id */
  setCurrent(id) {
    if (!this.#themes.has(id)) return;
    this.#current = id;
    this.#storage.set('theme', id);
    if (!this.#themes.get(id).isOverlay()) {
      this.#base = id;
      this.#storage.set('theme-base', id);
    }
  }

  /** @param {string} css @param {string} name @returns {boolean} */
  saveCustom(css, name) {
    this.#themes.set('custom', new ThemeDTO('custom', name, null, css));
    return this.#storage.set('custom-theme', css);
  }

  clear() {
    ['custom-langs', 'custom-theme', 'lang', 'theme', 'theme-base', 'ui'].forEach(key => this.#storage.remove(key));
  }
}
