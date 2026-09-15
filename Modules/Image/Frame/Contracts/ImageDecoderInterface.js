/* Внутренний порт: файл → готовая к отрисовке картинка.
   За портом стоит декодер браузера; в тестах — заглушка. */

/** @interface */
class ImageDecoderInterface {
  /** @param {PickedFileDTO} file @returns {Promise<SourceImageVO>} */
  async decode(file) { throw new Error('not implemented'); }
}

/** @type {symbol} */
const ImageDecoderToken = Symbol('ImageDecoderInterface');
