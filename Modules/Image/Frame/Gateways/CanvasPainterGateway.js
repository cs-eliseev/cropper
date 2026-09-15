/* Адаптер к контексту канваса: единственное место модуля, которое рисует.
   Ничего не решает — получает прямоугольник и кладёт пиксели. */

class CanvasPainterGateway {
  /**
   * @param {CanvasRenderingContext2D} context @param {number} width @param {number} height
   * @param {SourceImageVO} image @param {DrawRectDTO} rect @param {number} scale множитель цели
   * @param {string|null} matte
   */
  paintImage(context, width, height, image, rect, scale, matte) {
    if (matte === null) context.clearRect(0, 0, width, height);
    else { context.fillStyle = matte; context.fillRect(0, 0, width, height); }
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image.getElement(), rect.x * scale, rect.y * scale, rect.width * scale, rect.height * scale);
  }

  /**
   * Штриховка «картинки ещё нет» — часть интерфейса, поэтому цвета из темы.
   * @param {CanvasRenderingContext2D} context @param {number} width @param {number} height
   * @param {ThemeTokensDTO} tokens
   */
  paintPlaceholder(context, width, height, tokens) {
    context.fillStyle = tokens.hatch_a;
    context.fillRect(0, 0, width, height);
    context.strokeStyle = tokens.hatch_b;
    context.lineWidth = 9;
    context.beginPath();
    for (let x = -height; x < width + height; x += 18) {
      context.moveTo(x, 0);
      context.lineTo(x + height, height);
    }
    context.stroke();
  }
}
