/* Нарисовать кадр в переданный контекст: и превью, и экспорт идут этим путём,
   поэтому на экране ровно то, что окажется в файле. */

/** @implements {RenderFrameInterface} */
class RenderFrameAction {
  #frame;
  #canvas;
  #geometry;
  #painter;
  #tokens;

  /**
   * @param {FrameRepositoryInterface} frame @param {GetCanvasSizeInterface} canvas
   * @param {FrameGeometryService} geometry @param {CanvasPainterGateway} painter
   * @param {ThemeTokensInterface} tokens
   */
  constructor(frame, canvas, geometry, painter, tokens) {
    this.#frame = frame;
    this.#canvas = canvas;
    this.#geometry = geometry;
    this.#painter = painter;
    this.#tokens = tokens;
  }

  /** @param {RenderFrameDTO} dto */
  run(dto) {
    const image = this.#frame.findImage();
    if (!image) {
      this.#painter.paintPlaceholder(dto.context, dto.width, dto.height, this.#tokens.read());
      return;
    }
    const size = this.#canvas.run().toSize();
    const rect = this.#geometry.drawRect(size, image.getSize(), this.#frame.getZoom(), this.#frame.getOffset());
    this.#painter.paintImage(
      dto.context, dto.width, dto.height, image, rect, dto.width / size.getWidth(), dto.matte
    );
  }
}
