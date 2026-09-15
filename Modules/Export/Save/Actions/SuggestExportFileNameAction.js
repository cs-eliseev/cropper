/* Собрать имя файла по размеру холста. Если человек уже правил имя руками,
   операция ничего не меняет — это его выбор. */

class SuggestExportFileNameAction {
  #settings;
  #canvas;
  #names;
  #events;

  /**
   * @param {ExportSettingsRepositoryInterface} settings @param {GetCanvasSizeInterface} canvas
   * @param {FileNameService} names @param {EventBus} events
   */
  constructor(settings, canvas, names, events) {
    this.#settings = settings;
    this.#canvas = canvas;
    this.#names = names;
    this.#events = events;
  }

  /** @returns {ExportSettingsDTO} */
  run() {
    if (this.#settings.isFileNameManual()) return this.#settings.getSettings();
    this.#settings.updateFileName(
      this.#names.build(this.#canvas.run().toSize(), this.#settings.getFormat()), false
    );
    const result = this.#settings.getSettings();
    this.#events.publish(new ExportSettingsChangedEvent(result.format_id, result.quality, result.file_name));
    return result;
  }
}
