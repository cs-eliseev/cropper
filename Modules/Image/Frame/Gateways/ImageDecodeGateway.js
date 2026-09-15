/* Адаптер к декодеру браузера: файл → готовая к отрисовке картинка.
   Ошибку браузера заворачивает в доменную, оригинал кладёт в cause. */

/** @implements {ImageDecoderInterface} */
class ImageDecodeGateway {
  /** @param {PickedFileDTO} file @returns {Promise<SourceImageVO>} */
  decode(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file.blob);
      const element = new Image();
      element.onload = () => {
        URL.revokeObjectURL(url);
        resolve(new SourceImageVO(
          element,
          SizeVO.clamped(element.naturalWidth, element.naturalHeight),
          file.name
        ));
      };
      element.onerror = error => {
        URL.revokeObjectURL(url);
        reject(new ImageNotReadableException(file.name, error));
      };
      element.src = url;
    });
  }
}
