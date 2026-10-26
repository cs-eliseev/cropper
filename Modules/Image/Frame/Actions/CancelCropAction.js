/* Убрать рамку обрезки, ничего не меняя. */

class CancelCropAction {
  #frame;
  #events;

  /** @param {FrameRepositoryInterface} frame @param {EventBus} events */
  constructor(frame, events) {
    this.#frame = frame;
    this.#events = events;
  }

  /** @returns {CropAreaChangedEvent|null} null — рамки и не было */
  run() {
    if (!this.#frame.findCrop()) return null;
    this.#frame.updateCrop(null);
    const event = new CropAreaChangedEvent(false, 0, 0, 0, 0);
    this.#events.publish(event);
    return event;
  }
}
