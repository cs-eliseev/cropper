/* Раскрыть или свернуть блок панели. */

class ToggleBlockAction {
  #panel;
  #events;

  /** @param {PanelRepositoryInterface} panel @param {EventBus} events */
  constructor(panel, events) {
    this.#panel = panel;
    this.#events = events;
  }

  /** @param {ToggleBlockDTO} dto @returns {PanelStateDTO} */
  run(dto) {
    this.#panel.toggleBlock(dto.block_id);
    return this.#publish();
  }

  #publish() {
    const state = this.#panel.getState();
    this.#events.publish(new PanelChangedEvent(state.is_open, state.mode, state.open_blocks.slice()));
    return state;
  }
}
