/* Вся математика кадрирования. Чистая: получает значения, возвращает значения,
   ничего не хранит и ни о каком модуле не знает.

   Соглашение: zoom = 1 — картинка заполняет холст целиком (cover); меньше
   единицы — вписана с полями. Смещение 0..1 читается как background-position
   в процентах, поэтому работает одинаково и когда картинка больше холста,
   и когда меньше. */

class FrameGeometryService {
  /**
   * @param {SizeVO} canvas @param {SizeVO} image
   * @returns {number} во сколько раз растянуть картинку, чтобы заполнить холст
   */
  coverScale(canvas, image) {
    return Math.max(canvas.getWidth() / image.getWidth(), canvas.getHeight() / image.getHeight());
  }

  /**
   * @param {SizeVO} canvas @param {SizeVO} image
   * @returns {ZoomVO} приближение, при котором картинка видна целиком
   */
  containZoom(canvas, image) {
    const canvasRatio = canvas.getRatio();
    const sourceRatio = image.getRatio();
    return ZoomVO.clamped(sourceRatio > canvasRatio ? canvasRatio / sourceRatio : sourceRatio / canvasRatio);
  }

  /**
   * @param {SizeVO} canvas @param {SizeVO} image @param {ZoomVO} zoom @param {OffsetVO} offset
   * @returns {DrawRectDTO} прямоугольник картинки в единицах холста
   */
  drawRect(canvas, image, zoom, offset) {
    const scale = this.coverScale(canvas, image) * zoom.getValue();
    const width = image.getWidth() * scale;
    const height = image.getHeight() * scale;
    return new DrawRectDTO(
      (canvas.getWidth() - width) * offset.getX(),
      (canvas.getHeight() - height) * offset.getY(),
      width,
      height
    );
  }

  /**
   * Перетаскивание: сдвиг задаётся долей от стороны холста, чтобы не зависеть
   * от того, насколько уменьшено превью.
   * @param {SizeVO} canvas @param {SizeVO} image @param {ZoomVO} zoom
   * @param {OffsetVO} offset @param {number} dx_ratio @param {number} dy_ratio
   * @returns {OffsetVO}
   */
  offsetAfterDrag(canvas, image, zoom, offset, dx_ratio, dy_ratio) {
    const rect = this.drawRect(canvas, image, zoom, offset);
    const spanX = canvas.getWidth() - rect.width;
    const spanY = canvas.getHeight() - rect.height;
    const x = Math.abs(spanX) > 0.001 ? offset.getX() + (dx_ratio * canvas.getWidth()) / spanX : offset.getX();
    const y = Math.abs(spanY) > 0.001 ? offset.getY() + (dy_ratio * canvas.getHeight()) / spanY : offset.getY();
    return OffsetVO.clamped(x, y);
  }

  /**
   * Приближение к точке под курсором: точка остаётся на месте.
   * @param {SizeVO} canvas @param {SizeVO} image @param {OffsetVO} offset
   * @param {ZoomVO} from @param {ZoomVO} to @param {OffsetVO} anchor доля стороны холста
   * @returns {OffsetVO}
   */
  offsetAfterZoom(canvas, image, offset, from, to, anchor) {
    const before = this.drawRect(canvas, image, from, offset);
    const after = this.drawRect(canvas, image, to, offset);
    const pointX = anchor.getX() * canvas.getWidth();
    const pointY = anchor.getY() * canvas.getHeight();
    const holdX = before.width ? (pointX - before.x) / before.width : 0.5;
    const holdY = before.height ? (pointY - before.y) / before.height : 0.5;
    const spanX = canvas.getWidth() - after.width;
    const spanY = canvas.getHeight() - after.height;
    const x = Math.abs(spanX) > 0.001 ? (pointX - holdX * after.width) / spanX : offset.getX();
    const y = Math.abs(spanY) > 0.001 ? (pointY - holdY * after.height) / spanY : offset.getY();
    return OffsetVO.clamped(x, y);
  }

  /**
   * @param {SizeVO} canvas @param {SizeVO} image @param {ZoomVO} zoom
   * @returns {SizeVO} размер картинки на холсте при текущем масштабе
   */
  drawnSize(canvas, image, zoom) {
    const rect = this.drawRect(canvas, image, zoom, OffsetVO.centered());
    return SizeVO.clamped(rect.width, rect.height);
  }

  /**
   * @param {SizeVO} canvas @param {SizeVO} image
   * @returns {SizeVO} холст той же пропорции, что картинка, по меньшей стороне
   */
  fittedSize(canvas, image) {
    return image.getRatio() > canvas.getRatio()
      ? SizeVO.clamped(canvas.getWidth(), canvas.getWidth() / image.getRatio())
      : SizeVO.clamped(canvas.getHeight() * image.getRatio(), canvas.getHeight());
  }

  /**
   * @param {SizeVO} canvas @param {SizeVO} image
   * @returns {SizeVO} пропорции картинки при той же длинной стороне холста
   */
  matchedSize(canvas, image) {
    const factor = canvas.getLongSide() / image.getLongSide();
    return SizeVO.clamped(image.getWidth() * factor, image.getHeight() * factor);
  }

  /**
   * Во сколько раз оригинал растягивается, чтобы закрыть холст: меньше единицы —
   * запас есть, больше — картинку тянут вверх и она поплывёт.
   * @param {SizeVO} canvas @param {SizeVO} image @param {ZoomVO} zoom
   * @returns {number}
   */
  upscaleFactor(canvas, image, zoom) {
    const rect = this.drawRect(canvas, image, zoom, OffsetVO.centered());
    return rect.width ? rect.width / image.getWidth() : 1;
  }

  /**
   * @param {SizeVO} canvas @param {SizeVO} image @param {ZoomVO} zoom
   * @returns {number} сколько пикселей оригинала попадает в ширину холста
   */
  visibleSourceWidth(canvas, image, zoom) {
    const factor = this.upscaleFactor(canvas, image, zoom);
    const rect = this.drawRect(canvas, image, zoom, OffsetVO.centered());
    return factor ? Math.min(canvas.getWidth(), rect.width) / factor : canvas.getWidth();
  }
}
