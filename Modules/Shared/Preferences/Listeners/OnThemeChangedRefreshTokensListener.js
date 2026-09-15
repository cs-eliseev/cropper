/* Тема сменилась — сбросить кэш токенов и обновить список в настройках.
   Файл темы грузится асинхронно, поэтому кэш сбрасывается ещё раз на следующем кадре. */

class OnThemeChangedRefreshTokensListener {
  #tokens;
  #view;

  /** @param {ThemeTokensInterface} tokens @param {PreferencesView} view */
  constructor(tokens, view) {
    this.#tokens = tokens;
    this.#view = view;
  }

  /** @param {ThemeChangedEvent} event */
  handle(event) {
    this.#tokens.invalidate();
    this.#view.render();
    requestAnimationFrame(() => this.#tokens.invalidate());
  }
}
