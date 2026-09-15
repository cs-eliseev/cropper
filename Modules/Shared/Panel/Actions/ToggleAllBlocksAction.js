/* Свернуть или раскрыть все блоки разом. */

class ToggleAllBlocksAction {
  #panel;
  #events;

  constructor(panel, events) {
    this.#panel = panel;
    this.#events = events;
  }

  /** @returns {PanelStateDTO} */
  run() {
    const has_open = this.#panel.getState().open_blocks.length > 0;
    this.#panel.updateAllBlocks(!has_open);
    const state = this.#panel.getState();
    this.#events.publish(new PanelChangedEvent(state.is_open, state.mode, state.open_blocks.slice()));
    return state;
  }
}
