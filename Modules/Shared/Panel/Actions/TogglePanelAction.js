/* Свернуть или развернуть саму панель. */

class TogglePanelAction {
  #panel;
  #events;

  constructor(panel, events) {
    this.#panel = panel;
    this.#events = events;
  }

  /** @returns {PanelStateDTO} */
  run() {
    this.#panel.updateOpen(!this.#panel.getState().is_open);
    const state = this.#panel.getState();
    this.#events.publish(new PanelChangedEvent(state.is_open, state.mode, state.open_blocks.slice()));
    return state;
  }
}
