/* Убрать всё принесённое файлами и запомненный выбор — вернуться к config.js. */

class ResetPreferencesAction {
  #themes;

  /** @param {ThemeRepositoryInterface} themes */
  constructor(themes) {
    this.#themes = themes;
  }

  /** @returns {void} страница перезагружается: состояние модулей собирается заново */
  run() {
    this.#themes.clear();
    location.reload();
  }
}
