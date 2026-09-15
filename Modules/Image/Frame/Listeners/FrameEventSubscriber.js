/* Одна реакция на все события, после которых кадр выглядит иначе:
   свой размер, своя картинка, чужой размер холста, чужая тема и язык.
   Тонкий: только перерисовка, решений не принимает. */

class FrameEventSubscriber {
  #preview;
  #settings;

  /** @param {FramePreviewView} preview @param {FrameSettingsView} settings */
  constructor(preview, settings) {
    this.#preview = preview;
    this.#settings = settings;
  }

  /** @param {object} event */
  handle(event) {
    this.#preview.render();
    this.#settings.render();
  }
}
