/* Внутренний порт: что в панели раскрыто и свёрнута ли она сама. */

/** @interface */
class PanelRepositoryInterface {
  /** @returns {string[]} блоки в порядке показа */
  listBlocks() { throw new Error('not implemented'); }
  /** @returns {PanelStateDTO} */
  getState() { throw new Error('not implemented'); }
  /** @param {string} block_id */
  toggleBlock(block_id) { throw new Error('not implemented'); }
  /** @param {boolean} is_open */
  updateOpen(is_open) { throw new Error('not implemented'); }
  /** @param {string} mode 'single' или 'multi' */
  updateMode(mode) { throw new Error('not implemented'); }
  /** @param {boolean} is_open раскрыть или свернуть все */
  updateAllBlocks(is_open) { throw new Error('not implemented'); }
}

/** @type {symbol} */
const PanelRepositoryToken = Symbol('PanelRepositoryInterface');
