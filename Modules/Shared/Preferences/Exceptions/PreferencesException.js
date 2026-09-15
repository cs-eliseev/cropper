/* Базовая ошибка модуля настроек. */

class PreferencesException extends Error {
  constructor(message) {
    super(message);
    this.name = new.target.name;
  }

  getDetails() { return {}; }
}
