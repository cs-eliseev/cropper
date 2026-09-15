/* Сменить качество сжатия. */

class ChangeExportQualityAction {
  #settings;
  #events;

  constructor(settings, events) {
    this.#settings = settings;
    this.#events = events;
  }

  /** @param {ChangeExportQualityDTO} dto @returns {ExportSettingsDTO} */
  run(dto) {
    this.#settings.updateQuality(Math.min(1, Math.max(0.1, dto.quality)));
    const result = this.#settings.getSettings();
    this.#events.publish(new ExportSettingsChangedEvent(result.format_id, result.quality, result.file_name));
    return result;
  }
}
