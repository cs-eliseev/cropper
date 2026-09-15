/* Адаптер к вычисленным стилям: достаёт значения токенов, которые нужны
   отрисовке на канвасе. Кэш сбрасывается, когда тема сменилась. */

/** @implements {ThemeTokensInterface} */
class CssTokenGateway {
  #root;
  #cache = null;
  #fallback;

  /** @param {HTMLElement} root @param {ThemeTokensDTO} fallback значения, если тема ещё не загрузилась */
  constructor(root, fallback) {
    this.#root = root;
    this.#fallback = fallback;
  }

  /** @returns {ThemeTokensDTO} */
  read() {
    if (this.#cache) return this.#cache;
    const style = getComputedStyle(this.#root);
    const value = (name, fallback) => (style.getPropertyValue(name) || '').trim() || fallback;
    this.#cache = new ThemeTokensDTO(
      value('--canvas-bg', this.#fallback.canvas_bg),
      value('--hatch-a', this.#fallback.hatch_a),
      value('--hatch-b', this.#fallback.hatch_b)
    );
    return this.#cache;
  }

  invalidate() { this.#cache = null; }
}
