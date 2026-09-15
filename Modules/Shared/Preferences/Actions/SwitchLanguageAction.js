/* Переключить язык интерфейса. */

class SwitchLanguageAction {
  #languages;
  #events;

  /** @param {LanguageRepositoryInterface} languages @param {EventBus} events */
  constructor(languages, events) {
    this.#languages = languages;
    this.#events = events;
  }

  /** @param {SwitchLanguageDTO} dto @returns {LanguageDTO} */
  run(dto) {
    const language = this.#languages.findByCode(dto.code);
    if (!language) return this.#languages.getCurrent();
    this.#languages.setCurrent(language.code);
    this.#events.publish(new LanguageChangedEvent(language.code, language.dir));
    return language;
  }
}
