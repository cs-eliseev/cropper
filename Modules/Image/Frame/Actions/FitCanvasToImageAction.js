/* Подогнать холст под пропорции картинки, оставив меньшую сторону. */

class FitCanvasToImageAction {
  #frame;
  #canvas;
  #resize;
  #geometry;
  #events;

  constructor(frame, canvas, resize, geometry, events) {
    this.#frame = frame;
    this.#canvas = canvas;
    this.#resize = resize;
    this.#geometry = geometry;
    this.#events = events;
  }

  /** @returns {CanvasSizeDTO|null} */
  run() {
    const image = this.#frame.findImage();
    if (!image) return null;
    const size = this.#geometry.fittedSize(this.#canvas.run().toSize(), image.getSize());
    const result = this.#resize.run(new ResizeCanvasDTO(size.getWidth(), size.getHeight()));
    const zoom = ZoomVO.fill();
    const offset = OffsetVO.centered();
    this.#frame.updateFrame(zoom, offset);
    this.#events.publish(new FrameChangedEvent(zoom.getValue(), offset.getX(), offset.getY()));
    return result;
  }
}
