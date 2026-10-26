/* Сжать холст до того, что реально видно при текущем масштабе.
   Размер холста — чужое хозяйство, поэтому идём через контракт модуля. */

class TrimCanvasToVisibleAction {
  #frame;
  #canvas;
  #resize;
  #geometry;
  #events;

  /**
   * @param {FrameRepositoryInterface} frame @param {GetCanvasSizeInterface} canvas
   * @param {ResizeCanvasInterface} resize @param {FrameGeometryService} geometry @param {EventBus} events
   */
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
    const zoom = this.#frame.getZoom();
    const size = this.#geometry.drawnSize(this.#canvas.run().toSize(), image.getSize(), zoom);
    const result = this.#resize.run(new ResizeCanvasDTO(size.getWidth(), size.getHeight()));
    this.#centerFrame(zoom);
    return result;
  }

  /** масштаб тот же — холст теперь ровно по картинке, остаётся её отцентровать */
  #centerFrame(zoom) {
    const offset = OffsetVO.centered();
    this.#frame.updateFrame(zoom, offset);
    this.#events.publish(new FrameChangedEvent(zoom.getValue(), offset.getX(), offset.getY()));
  }
}
