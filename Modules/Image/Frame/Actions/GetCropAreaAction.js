/* Рамка обрезки числами — для отрисовки и для жестов над ней. */

class GetCropAreaAction {
  #frame;
  #canvas;

  /** @param {FrameRepositoryInterface} frame @param {GetCanvasSizeInterface} canvas */
  constructor(frame, canvas) {
    this.#frame = frame;
    this.#canvas = canvas;
  }

  /** @returns {CropAreaDTO} */
  run() {
    const crop = this.#frame.findCrop();
    if (!crop) return new CropAreaDTO(false, 0, 0, 0, 0, 0, 0);
    const size = this.#canvas.run();
    return new CropAreaDTO(
      true,
      crop.x / size.width, crop.y / size.height, crop.width / size.width, crop.height / size.height,
      Math.round(crop.width), Math.round(crop.height)
    );
  }
}
