/* Перерисовка блока после всего, что меняет его показания. */

class ExportEventSubscriber {
  #view;

  /** @param {ExportView} view */
  constructor(view) {
    this.#view = view;
  }

  /** @param {object} event */
  handle(event) { this.#view.render(); }
}
