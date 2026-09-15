/* Адаптер к канвасу браузера: создаёт холст нужного размера и умеет
   отдать его содержимое файлом. Единственное место модуля, знающее про DOM. */

/** @implements {CanvasFactoryInterface} */
class BrowserCanvasGateway {
  /** @param {SizeVO} size @returns {ExportTargetDTO} */
  create(size) {
    const canvas = document.createElement('canvas');
    canvas.width = size.getWidth();
    canvas.height = size.getHeight();
    return new ExportTargetDTO(
      canvas.getContext('2d'),
      (mime, quality) => new Promise(resolve => canvas.toBlob(resolve, mime, quality))
    );
  }
}
