/* Внутренний порт: формат, качество и имя файла. */

/** @interface */
class ExportSettingsRepositoryInterface {
  /** @returns {ExportSettingsDTO} */
  getSettings() { throw new Error('not implemented'); }
  /** @returns {ExportFormatDTO} */
  getFormat() { throw new Error('not implemented'); }
  /** @returns {ExportFormatDTO[]} */
  listFormats() { throw new Error('not implemented'); }
  /** @param {string} format_id */
  updateFormat(format_id) { throw new Error('not implemented'); }
  /** @param {number} quality */
  updateQuality(quality) { throw new Error('not implemented'); }
  /** @param {string} file_name @param {boolean} is_manual */
  updateFileName(file_name, is_manual) { throw new Error('not implemented'); }
  /** @returns {boolean} правил ли имя человек — тогда его не трогаем */
  isFileNameManual() { throw new Error('not implemented'); }
}

/** @type {symbol} */
const ExportSettingsRepositoryToken = Symbol('ExportSettingsRepositoryInterface');
