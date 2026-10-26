/* Обрезать холст по рамке. Картинка остаётся на месте и в том же масштабе —
   меняется только холст. Размер холста — чужое хозяйство, поэтому идём
   через контракт модуля. */

class ApplyCropAction {
  #frame;
  #canvas;
  #resize;
  #geometry;
  #events;

  /**
   * @param {FrameRepositoryInterface} frame @param {GetCanvasSizeInterface} canvas
   * @param {ResizeCanvasInterface} resize @param {FrameGeometryService} geometry @param {EventBus} events
   */
  constructor(frame, canvas, resize, geometry, events) {
    this.#frame = frame;
    this.#canvas = canvas;
    this.#resize = resize;
    this.#geometry = geometry;
    this.#events = events;
  }

  /** @returns {CanvasSizeDTO|null} null — рамки нет или она пустая */
  run() {
    const image = this.#frame.findImage();
    const crop = this.#frame.findCrop();
    if (!image || !crop) return null;
    const x = Math.round(crop.x);
    const y = Math.round(crop.y);
    if (Math.round(crop.width) < 1 || Math.round(crop.height) < 1) return null;

    const size = SizeVO.clamped(crop.width, crop.height);
    const zoom = this.#frame.getZoom();
    const offset = this.#geometry.offsetAfterCrop(
      this.#canvas.run().toSize(), image.getSize(), zoom, this.#frame.getOffset(),
      new DrawRectDTO(x, y, size.getWidth(), size.getHeight())
    );

    /* кадр готов раньше холста: перерисовка по смене холста уже увидит итог */
    this.#frame.updateCrop(null);
    this.#frame.updateFrame(zoom, offset);
    const result = this.#resize.run(new ResizeCanvasDTO(size.getWidth(), size.getHeight()));
    this.#events.publish(new FrameChangedEvent(zoom.getValue(), offset.getX(), offset.getY()));
    return result;
  }
}
