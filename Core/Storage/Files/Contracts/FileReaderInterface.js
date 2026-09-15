/* Порт чтения файла с диска. Диалог выбора открывает реализация;
   отказ пользователя — не ошибка, а null. */

/** @interface */
class FileReaderInterface {
  /** @param {string} accept маска для диалога @returns {Promise<PickedFileDTO|null>} */
  async pick(accept) { throw new Error('not implemented'); }

  /** @param {string} accept @returns {Promise<PickedFileDTO|null>} с заполненным text */
  async pickText(accept) { throw new Error('not implemented'); }
}

/** @type {symbol} */
const FileReaderToken = Symbol('FileReaderInterface');
