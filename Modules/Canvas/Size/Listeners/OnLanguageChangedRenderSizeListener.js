/* Язык сменился — пересобрать названия шаблонов. */

class OnLanguageChangedRenderSizeListener {
  #view;
  #onPick;

  /** @param {CanvasSizeView} view @param {(preset: CanvasPresetDTO) => void} onPick */
  constructor(view, onPick) {
    this.#view = view;
    this.#onPick = onPick;
  }

  /** @param {LanguageChangedEvent} event */
  handle(event) {
    this.#view.buildPresets(this.#onPick);
    this.#view.render();
  }
}
