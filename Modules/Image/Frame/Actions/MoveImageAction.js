/* Подвинуть картинку в кадре. */

class MoveImageAction {
  #frame;
  #canvas;
  #geometry;
  #events;

  constructor(frame, canvas, geometry, events) {
    this.#frame = frame;
    this.#canvas = canvas;
    this.#geometry = geometry;
    this.#events = events;
  }

  /** @param {MoveImageDTO} dto @returns {FrameChangedEvent|null} */
  run(dto) {
    const image = this.#frame.findImage();
    if (!image) return null;
    const zoom = this.#frame.getZoom();
    const offset = this.#geometry.offsetAfterDrag(
      this.#canvas.run().toSize(), image.getSize(), zoom,
      OffsetVO.clamped(dto.from_x, dto.from_y), dto.dx_ratio, dto.dy_ratio
    );
    this.#frame.updateFrame(zoom, offset);
    const event = new FrameChangedEvent(zoom.getValue(), offset.getX(), offset.getY());
    this.#events.publish(event);
    return event;
  }
}
