/* Язык сменился — перерисовать статические строки и своё окно настроек. */

class OnLanguageChangedRenderPreferencesListener {
  #staticText;
  #view;
  #languages;

  /** @param {StaticTextView} staticText @param {PreferencesView} view @param {LanguageRepositoryInterface} languages */
  constructor(staticText, view, languages) {
    this.#staticText = staticText;
    this.#view = view;
    this.#languages = languages;
  }

  /** @param {LanguageChangedEvent} event */
  handle(event) {
    this.#staticText.render(this.#languages.getCurrent());
    this.#view.render();
  }
}
