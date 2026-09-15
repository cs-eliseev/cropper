/* Приблизить или отдалить, удержав точку под курсором. */

class ZoomImageAction {
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

  /** @param {ZoomImageDTO} dto @returns {FrameChangedEvent|null} */
  run(dto) {
    const image = this.#frame.findImage();
    if (!image) return null;
    const from = this.#frame.getZoom();
    const to = ZoomVO.clamped(dto.zoom);
    const offset = this.#geometry.offsetAfterZoom(
      this.#canvas.run().toSize(), image.getSize(), this.#frame.getOffset(),
      from, to, OffsetVO.clamped(dto.anchor_x, dto.anchor_y)
    );
    this.#frame.updateFrame(to, offset);
    const event = new FrameChangedEvent(to.getValue(), offset.getX(), offset.getY());
    this.#events.publish(event);
    return event;
  }
}
