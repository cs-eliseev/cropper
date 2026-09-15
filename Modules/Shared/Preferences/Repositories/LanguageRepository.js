/* Словари: встроенные приходят при регистрации модуля, принесённые файлами
   лежат в хранилище. Единственное место, которое знает, где что хранится. */

/** @implements {LanguageRepositoryInterface} */
class LanguageRepository {
  #storage;
  #languages = new Map();
  #current = '';
  #fallback;

  /**
   * @param {KeyValueStorageInterface} storage
   * @param {LanguageDTO[]} builtin словари, подключённые файлами рядом со страницей
   * @param {string} fallback код запасного языка
   * @param {string} preferred код из настроек или 'auto'
   */
  constructor(storage, builtin, fallback, preferred) {
    this.#storage = storage;
    this.#fallback = fallback;
    builtin.forEach(language => this.#languages.set(language.code, language));
    this.#restoreCustom();
    this.#current = this.#pickInitial(preferred);
  }

  /** @returns {LanguageDTO[]} */
  listLanguages() { return [...this.#languages.values()]; }

  /** @returns {LanguageDTO} */
  getCurrent() { return this.#languages.get(this.#current); }

  /** @returns {LanguageDTO[]} выбранный, затем запасной — для перевода */
  getChain() {
    const chain = [this.getCurrent(), this.#languages.get(this.#fallback)];
    return chain.concat(this.listLanguages()).filter(Boolean);
  }

  /** @param {string} code @returns {LanguageDTO|null} */
  findByCode(code) { return this.#languages.get(code) || null; }

  /** @param {string} code */
  setCurrent(code) {
    if (!this.#languages.has(code)) return;
    this.#current = code;
    this.#storage.set('lang', code);
  }

  /** @param {LanguageDTO} language @returns {boolean} удалось ли запомнить */
  saveCustom(language) {
    this.#languages.set(language.code, language);
    const saved = this.#storage.get('custom-langs', {});
    saved[language.code] = { code: language.code, name: language.name, dir: language.dir, strings: language.strings };
    return this.#storage.set('custom-langs', saved);
  }

  #restoreCustom() {
    const saved = this.#storage.get('custom-langs', {});
    Object.keys(saved).forEach(code => {
      const raw = saved[code];
      if (raw && raw.strings) this.#languages.set(code, new LanguageDTO(raw.code, raw.name, raw.dir, raw.strings));
    });
  }

  /** @param {string} preferred */
  #pickInitial(preferred) {
    const saved = this.#storage.get('lang');
    if (saved && this.#languages.has(saved)) return saved;
    if (preferred && preferred !== 'auto' && this.#languages.has(preferred)) return preferred;
    const browser = (navigator.language || '').slice(0, 2);
    if (this.#languages.has(browser)) return browser;
    if (this.#languages.has(this.#fallback)) return this.#fallback;
    return this.listLanguages()[0].code;
  }
}
