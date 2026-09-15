/* Вписать картинку в холст целиком — с полями, если пропорции разные. */

class FitImageAction {
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

  /** @returns {FrameChangedEvent|null} */
  run() {
    const image = this.#frame.findImage();
    if (!image) return null;
    const zoom = this.#geometry.containZoom(this.#canvas.run().toSize(), image.getSize());
    const offset = OffsetVO.centered();
    this.#frame.updateFrame(zoom, offset);
    const event = new FrameChangedEvent(zoom.getValue(), offset.getX(), offset.getY());
    this.#events.publish(event);
    return event;
  }
}
