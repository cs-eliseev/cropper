/* Чистая оценка запаса: сколько пикселей оригинала попадает в кадр
   и не растягиваем ли мы картинку вверх. Ни хранилища, ни DOM. */

class QualityEstimateService {
  #geometry;

  /** @param {FrameGeometryService} geometry */
  constructor(geometry) {
    this.#geometry = geometry;
  }

  /**
   * @param {SizeVO} canvas @param {SizeVO} image @param {ZoomVO} zoom
   * @returns {QualityEstimateDTO}
   */
  estimate(canvas, image, zoom) {
    const upscale = this.#geometry.upscaleFactor(canvas, image, zoom);
    const source_px = Math.round(this.#geometry.visibleSourceWidth(canvas, image, zoom));
    return new QualityEstimateDTO(upscale <= 1, source_px, canvas.getWidth(), upscale);
  }
}
