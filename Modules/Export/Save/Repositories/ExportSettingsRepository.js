/* Настройки сохранения: формат и качество переживают перезагрузку,
   имя файла собирается заново, пока его не правил человек. */

/** @implements {ExportSettingsRepositoryInterface} */
class ExportSettingsRepository {
  #storage;
  #formats;
  #format_id;
  #quality;
  #file_name = '';
  #is_manual = false;

  /**
   * @param {KeyValueStorageInterface} storage @param {ExportFormatDTO[]} formats
   * @param {number} default_quality
   */
  constructor(storage, formats, default_quality) {
    this.#storage = storage;
    this.#formats = formats;
    const saved = storage.get('export', {});
    this.#format_id = formats.some(f => f.id === saved.format_id) ? saved.format_id : formats[0].id;
    this.#quality = typeof saved.quality === 'number' ? saved.quality : default_quality;
  }

  /** @returns {ExportSettingsDTO} */
  getSettings() { return new ExportSettingsDTO(this.#format_id, this.#quality, this.#file_name); }

  /** @returns {ExportFormatDTO} */
  getFormat() { return this.#formats.find(format => format.id === this.#format_id); }

  /** @returns {ExportFormatDTO[]} */
  listFormats() { return this.#formats; }

  /** @param {string} format_id */
  updateFormat(format_id) {
    if (!this.#formats.some(format => format.id === format_id)) return;
    this.#format_id = format_id;
    this.#persist();
  }

  /** @param {number} quality */
  updateQuality(quality) {
    this.#quality = quality;
    this.#persist();
  }

  /** @param {string} file_name @param {boolean} is_manual */
  updateFileName(file_name, is_manual) {
    this.#file_name = file_name;
    if (is_manual) this.#is_manual = true;
  }

  /** @returns {boolean} */
  isFileNameManual() { return this.#is_manual; }

  #persist() {
    this.#storage.set('export', { format_id: this.#format_id, quality: this.#quality });
  }
}
