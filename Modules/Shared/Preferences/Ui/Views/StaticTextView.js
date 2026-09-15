/* Подставляет строки в размеченные места: data-i18n — текст,
   data-i18n-title — подсказка, data-i18n-ph — placeholder.
   Адаптер вывода: решений не принимает. */

class StaticTextView {
  #translator;

  /** @param {TranslatorInterface} translator */
  constructor(translator) {
    this.#translator = translator;
  }

  /** @param {LanguageDTO} language */
  render(language) {
    const t = key => this.#translator.translate(key);
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.dir;
    document.title = t('docTitle');
  }
}
