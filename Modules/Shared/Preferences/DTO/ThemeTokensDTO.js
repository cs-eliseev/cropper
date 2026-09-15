/* Токены, которые нужны отрисовке на канвасе. */

class ThemeTokensDTO {
  /** @param {string} canvas_bg @param {string} hatch_a @param {string} hatch_b */
  constructor(canvas_bg, hatch_a, hatch_b) {
    this.canvas_bg = canvas_bg;
    this.hatch_a = hatch_a;
    this.hatch_b = hatch_b;
    Object.freeze(this);
  }
}
