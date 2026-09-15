/* Тема переключена. */

class ThemeChangedEvent {
  /** @param {string} theme_id */
  constructor(theme_id) {
    this.theme_id = theme_id;
    this.occurred_at = new Date().toISOString();
    Object.freeze(this);
  }
}
