/* Подвинуть, растянуть или нарисовать заново рамку обрезки. */

class ChangeCropAction {
  #frame;
  #canvas;
  #geometry;
  #areas;
  #events;

  /**
   * @param {FrameRepositoryInterface} frame @param {GetCanvasSizeInterface} canvas
   * @param {FrameGeometryService} geometry @param {CropAreaService} areas @param {EventBus} events
   */
  constructor(frame, canvas, geometry, areas, events) {
    this.#frame = frame;
    this.#canvas = canvas;
    this.#geometry = geometry;
    this.#areas = areas;
    this.#events = events;
  }

  /** @param {ChangeCropDTO} dto @returns {CropAreaChangedEvent|null} null — обрезка не идёт */
  run(dto) {
    const image = this.#frame.findImage();
    if (!image || !this.#frame.findCrop()) return null;
    const size = this.#canvas.run().toSize();
    const width = size.getWidth();
    const height = size.getHeight();
    const bounds = this.#geometry.visibleRect(size, image.getSize(), this.#frame.getZoom(), this.#frame.getOffset());
    const area = this.#areas.dragged(
      new DrawRectDTO(dto.from_x * width, dto.from_y * height, dto.from_width * width, dto.from_height * height),
      dto.handle, dto.dx_ratio * width, dto.dy_ratio * height, bounds, dto.keep_ratio
    );
    this.#frame.updateCrop(area);
    const event = new CropAreaChangedEvent(true, area.x, area.y, area.width, area.height);
    this.#events.publish(event);
    return event;
  }
}
