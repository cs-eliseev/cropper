class SetAccordionModeDTO {
  /** @param {string} mode 'single' — по одному, 'multi' — сколько угодно */
  constructor(mode) {
    this.mode = mode;
    Object.freeze(this);
  }
}
