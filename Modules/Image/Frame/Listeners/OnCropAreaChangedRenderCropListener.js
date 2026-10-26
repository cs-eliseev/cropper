/* Рамка обрезки поменялась — перерисовать только её, кадр тот же. */

class OnCropAreaChangedRenderCropListener {
  #view;

  /** @param {CropAreaView} view */
  constructor(view) {
    this.#view = view;
  }

  /** @param {CropAreaChangedEvent} event */
  handle(event) {
    this.#view.render();
  }
}
