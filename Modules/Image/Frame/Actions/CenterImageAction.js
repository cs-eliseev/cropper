/* Вернуть картинку в центр, не трогая приближение. */

class CenterImageAction {
  #frame;
  #events;

  constructor(frame, events) {
    this.#frame = frame;
    this.#events = events;
  }

  /** @returns {FrameChangedEvent|null} */
  run() {
    if (!this.#frame.findImage()) return null;
    const zoom = this.#frame.getZoom();
    const offset = OffsetVO.centered();
    this.#frame.updateFrame(zoom, offset);
    const event = new FrameChangedEvent(zoom.getValue(), offset.getX(), offset.getY());
    this.#events.publish(event);
    return event;
  }
}
