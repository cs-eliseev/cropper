class PanelChangedEvent {
  /** @param {boolean} is_open @param {string} mode @param {string[]} open_blocks */
  constructor(is_open, mode, open_blocks) {
    this.is_open = is_open;
    this.mode = mode;
    this.open_blocks = Object.freeze(open_blocks.slice());
    this.occurred_at = new Date().toISOString();
    Object.freeze(this);
  }
}
