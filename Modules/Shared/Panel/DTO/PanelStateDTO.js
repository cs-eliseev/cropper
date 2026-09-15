/* Состояние панели наружу. */

class PanelStateDTO {
  /** @param {boolean} is_open @param {string} mode @param {string[]} open_blocks */
  constructor(is_open, mode, open_blocks) {
    this.is_open = is_open;
    this.mode = mode;
    this.open_blocks = Object.freeze(open_blocks.slice());
    Object.freeze(this);
  }

  /** @param {string} block_id */
  isBlockOpen(block_id) { return this.open_blocks.indexOf(block_id) >= 0; }
}
