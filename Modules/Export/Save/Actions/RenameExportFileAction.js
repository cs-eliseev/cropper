/* Переименовать выходной файл. Правка человеком запоминается:
   после неё имя больше не пересобирается автоматически. */

class RenameExportFileAction {
  #settings;
  #events;

  constructor(settings, events) {
    this.#settings = settings;
    this.#events = events;
  }

  /** @param {RenameExportFileDTO} dto @returns {ExportSettingsDTO} */
  run(dto) {
    this.#settings.updateFileName(dto.file_name, dto.is_manual);
    const result = this.#settings.getSettings();
    this.#events.publish(new ExportSettingsChangedEvent(result.format_id, result.quality, result.file_name));
    return result;
  }
}
