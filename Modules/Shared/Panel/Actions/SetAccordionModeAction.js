/* Открывать несколько блоков сразу или по одному. */

class SetAccordionModeAction {
  #panel;
  #events;

  constructor(panel, events) {
    this.#panel = panel;
    this.#events = events;
  }

  /** @param {SetAccordionModeDTO} dto @returns {PanelStateDTO} */
  run(dto) {
    this.#panel.updateMode(dto.mode);
    const state = this.#panel.getState();
    this.#events.publish(new PanelChangedEvent(state.is_open, state.mode, state.open_blocks.slice()));
    return state;
  }
}
