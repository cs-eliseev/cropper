/* Одна реакция на все события, после которых кадр выглядит иначе:
   свой размер, своя картинка, чужой размер холста, чужая тема и язык.
   Тонкий: только перерисовка, решений не принимает. */

class FrameEventSubscriber {
  #preview;
  #settings;
  #crop;

  /** @param {FramePreviewView} preview @param {FrameSettingsView} settings @param {CropAreaView} crop */
  constructor(preview, settings, crop) {
    this.#preview = preview;
    this.#settings = settings;
    this.#crop = crop;
  }

  /** @param {object} event */
  handle(event) {
    this.#preview.render();
    this.#settings.render();
    this.#crop.render();
  }
}
