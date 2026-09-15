/* Подключить словарь с диска и сразу переключиться на него. */

class ImportLanguageAction {
  #files;
  #languages;
  #mapper;
  #events;

  /**
   * @param {FileReaderInterface} files @param {LanguageRepositoryInterface} languages
   * @param {LanguageFileMapper} mapper @param {EventBus} events
   */
  constructor(files, languages, mapper, events) {
    this.#files = files;
    this.#languages = languages;
    this.#mapper = mapper;
    this.#events = events;
  }

  /** @returns {Promise<ImportedLanguageDTO|null>} null — пользователь отказался от выбора */
  async run() {
    const file = await this.#files.pickText('.json,.js,application/json,text/javascript');
    if (!file) return null;
    const language = this.#mapper.toLanguage(file);
    const stored = this.#languages.saveCustom(language);
    this.#languages.setCurrent(language.code);
    this.#events.publish(new LanguageChangedEvent(language.code, language.dir));
    return new ImportedLanguageDTO(language.code, stored);
  }
}
