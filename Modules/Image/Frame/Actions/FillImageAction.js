/* Заполнить холст картинкой: края обрезаются. */

class FillImageAction {
  #frame;
  #canvas;
  #geometry;
  #events;

  /**
   * @param {FrameRepositoryInterface} frame @param {GetCanvasSizeInterface} canvas
   * @param {FrameGeometryService} geometry @param {EventBus} events
   */
  constructor(frame, canvas, geometry, events) {
    this.#frame = frame;
    this.#canvas = canvas;
    this.#geometry = geometry;
    this.#events = events;
  }

  /** @returns {FrameChangedEvent|null} */
  run() {
    const image = this.#frame.findImage();
    if (!image) return null;
    const zoom = this.#geometry.coverZoom(this.#canvas.run().toSize(), image.getSize());
    const offset = OffsetVO.centered();
    this.#frame.updateFrame(zoom, offset);
    const event = new FrameChangedEvent(zoom.getValue(), offset.getX(), offset.getY());
    this.#events.publish(event);
    return event;
  }
}
