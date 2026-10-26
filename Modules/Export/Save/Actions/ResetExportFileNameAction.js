/* Новая картинка — новое имя файла: прежняя ручная правка относилась
   к прошлой картинке, поэтому имя снова собирается само. */

class ResetExportFileNameAction {
  #settings;
  #canvas;
  #frame;
  #names;
  #events;

  /**
   * @param {ExportSettingsRepositoryInterface} settings @param {GetCanvasSizeInterface} canvas
   * @param {GetFrameGeometryInterface} frame @param {FileNameService} names @param {EventBus} events
   */
  constructor(settings, canvas, frame, names, events) {
    this.#settings = settings;
    this.#canvas = canvas;
    this.#frame = frame;
    this.#names = names;
    this.#events = events;
  }

  /** @returns {ExportSettingsDTO} */
  run() {
    this.#settings.resetFileName(
      this.#names.build(this.#canvas.run().toSize(), this.#settings.getFormat(), this.#frame.run().image_name)
    );
    const result = this.#settings.getSettings();
    this.#events.publish(new ExportSettingsChangedEvent(result.format_id, result.quality, result.file_name));
    return result;
  }
}
