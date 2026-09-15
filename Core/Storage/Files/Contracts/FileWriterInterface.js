/* Порт отдачи файла пользователю. */

/** @interface */
class FileWriterInterface {
  /** @param {string} name имя файла @param {Blob} blob содержимое */
  save(name, blob) { throw new Error('not implemented'); }
}

/** @type {symbol} */
const FileWriterToken = Symbol('FileWriterInterface');
