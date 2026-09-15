/* Переключить тему оформления. */

class SwitchThemeAction {
  #themes;
  #sheets;
  #events;

  /** @param {ThemeRepositoryInterface} themes @param {StyleSheetGateway} sheets @param {EventBus} events */
  constructor(themes, sheets, events) {
    this.#themes = themes;
    this.#sheets = sheets;
    this.#events = events;
  }

  /** @param {SwitchThemeDTO} dto @returns {ThemeDTO} */
  run(dto) {
    this.#themes.setCurrent(dto.theme_id);
    const current = this.#themes.getCurrent();
    this.#sheets.apply(this.#themes.getBase(), current);
    this.#events.publish(new ThemeChangedEvent(current.id));
    return current;
  }
}
