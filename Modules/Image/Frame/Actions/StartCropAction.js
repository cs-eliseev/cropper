/* Начать обрезку: рамка сразу охватывает всю видимую картинку,
   дальше её подтягивают ручками или рисуют заново. */

class StartCropAction {
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

  /** @returns {CropAreaChangedEvent|null} null — картинки нет */
  run() {
    const image = this.#frame.findImage();
    if (!image) return null;
    const area = this.#geometry.visibleRect(
      this.#canvas.run().toSize(), image.getSize(), this.#frame.getZoom(), this.#frame.getOffset()
    );
    this.#frame.updateCrop(area);
    const event = new CropAreaChangedEvent(true, area.x, area.y, area.width, area.height);
    this.#events.publish(event);
    return event;
  }
}
