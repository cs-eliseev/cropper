/* Кадр или холст поменялись — рамка обрезки больше не про то, что на экране.
   Подписан и на FrameChangedEvent, и на CanvasResizedEvent. */

class OnFrameChangedCancelCropListener {
  #cancel;

  /** @param {CancelCropAction} cancel */
  constructor(cancel) {
    this.#cancel = cancel;
  }

  /** @param {object} event */
  handle(event) {
    this.#cancel.run();
  }
}
