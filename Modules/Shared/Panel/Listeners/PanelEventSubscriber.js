/* Перерисовка панели: своё изменение состояния и чужая смена языка. */

class PanelEventSubscriber {
  #view;

  /** @param {PanelView} view */
  constructor(view) {
    this.#view = view;
  }

  /** @param {object} event */
  handle(event) { this.#view.render(); }
}
