/* Заполнить холст картинкой: края обрезаются. */

class FillImageAction {
  #frame;
  #events;

  /** @param {FrameRepositoryInterface} frame @param {EventBus} events */
  constructor(frame, events) {
    this.#frame = frame;
    this.#events = events;
  }

  /** @returns {FrameChangedEvent|null} */
  run() {
    if (!this.#frame.findImage()) return null;
    const zoom = ZoomVO.fill();
    const offset = OffsetVO.centered();
    this.#frame.updateFrame(zoom, offset);
    const event = new FrameChangedEvent(zoom.getValue(), offset.getX(), offset.getY());
    this.#events.publish(event);
    return event;
  }
}
