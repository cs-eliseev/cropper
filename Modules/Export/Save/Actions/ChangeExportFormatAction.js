/* Сменить формат: расширение в имени файла идёт следом. */

class ChangeExportFormatAction {
  #settings;
  #names;
  #events;

  /**
   * @param {ExportSettingsRepositoryInterface} settings @param {FileNameService} names @param {EventBus} events
   */
  constructor(settings, names, events) {
    this.#settings = settings;
    this.#names = names;
    this.#events = events;
  }

  /** @param {ChangeExportFormatDTO} dto @returns {ExportSettingsDTO} */
  run(dto) {
    this.#settings.updateFormat(dto.format_id);
    const current = this.#settings.getSettings();
    this.#settings.updateFileName(
      this.#names.withExtension(current.file_name, this.#settings.getFormat()),
      this.#settings.isFileNameManual()
    );
    const result = this.#settings.getSettings();
    this.#events.publish(new ExportSettingsChangedEvent(result.format_id, result.quality, result.file_name));
    return result;
  }
}
