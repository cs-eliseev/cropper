/* Состояние панели: порядок блоков приходит из config.js, раскрытое
   и режим — из хранилища, если человек уже что-то менял. */

/** @implements {PanelRepositoryInterface} */
class PanelRepository {
  #storage;
  #blocks;
  #open_blocks;
  #is_open;
  #mode;

  /**
   * @param {KeyValueStorageInterface} storage
   * @param {string[]} blocks порядок блоков без скрытых
   * @param {string[]} open_by_default
   */
  constructor(storage, blocks, open_by_default) {
    this.#storage = storage;
    this.#blocks = blocks;
    const saved = storage.get('panel', {});
    this.#open_blocks = Array.isArray(saved.open_blocks)
      ? saved.open_blocks.filter(id => blocks.indexOf(id) >= 0)
      : open_by_default.filter(id => blocks.indexOf(id) >= 0);
    this.#is_open = typeof saved.is_open === 'boolean' ? saved.is_open : true;
    this.#mode = saved.mode === 'single' ? 'single' : 'multi';
  }

  /** @returns {string[]} */
  listBlocks() { return this.#blocks.slice(); }

  /** @returns {PanelStateDTO} */
  getState() { return new PanelStateDTO(this.#is_open, this.#mode, this.#open_blocks); }

  /** @param {string} block_id */
  toggleBlock(block_id) {
    const was_open = this.#open_blocks.indexOf(block_id) >= 0;
    if (this.#mode === 'single') this.#open_blocks = was_open ? [] : [block_id];
    else if (was_open) this.#open_blocks = this.#open_blocks.filter(id => id !== block_id);
    else this.#open_blocks = this.#open_blocks.concat([block_id]);
    this.#persist();
  }

  /** @param {boolean} is_open */
  updateOpen(is_open) {
    this.#is_open = is_open;
    this.#persist();
  }

  /** @param {string} mode */
  updateMode(mode) {
    this.#mode = mode === 'single' ? 'single' : 'multi';
    if (this.#mode === 'single' && this.#open_blocks.length > 1) {
      this.#open_blocks = this.#open_blocks.slice(0, 1);
    }
    this.#persist();
  }

  /** @param {boolean} is_open */
  updateAllBlocks(is_open) {
    this.#open_blocks = is_open ? this.#blocks.slice() : [];
    if (is_open) this.#mode = 'multi';
    this.#persist();
  }

  #persist() {
    this.#storage.set('panel', {
      open_blocks: this.#open_blocks, is_open: this.#is_open, mode: this.#mode
    });
  }
}
