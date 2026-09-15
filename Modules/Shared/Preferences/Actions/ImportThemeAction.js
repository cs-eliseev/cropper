/* Подключить тему с диска. Свой файл ложится поверх базовой темы,
   поэтому достаточно переопределить несколько токенов. */

class ImportThemeAction {
  #files;
  #themes;
  #sheets;
  #events;

  /**
   * @param {FileReaderInterface} files @param {ThemeRepositoryInterface} themes
   * @param {StyleSheetGateway} sheets @param {EventBus} events
   */
  constructor(files, themes, sheets, events) {
    this.#files = files;
    this.#themes = themes;
    this.#sheets = sheets;
    this.#events = events;
  }

  /** @param {string} custom_name @returns {Promise<ThemeDTO|null>} */
  async run(custom_name) {
    const file = await this.#files.pickText('.css,text/css');
    if (!file) return null;
    this.#themes.saveCustom(String(file.text), custom_name);
    this.#themes.setCurrent('custom');
    const current = this.#themes.getCurrent();
    this.#sheets.apply(this.#themes.getBase(), current);
    this.#events.publish(new ThemeChangedEvent(current.id));
    return current;
  }
}
