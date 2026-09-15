/* Состояние кадра числами — для тех, кому нельзя показывать саму картинку. */

/** @implements {GetFrameGeometryInterface} */
class GetFrameGeometryAction {
  #frame;

  /** @param {FrameRepositoryInterface} frame */
  constructor(frame) {
    this.#frame = frame;
  }

  /** @returns {FrameGeometryDTO} */
  run() {
    const image = this.#frame.findImage();
    const offset = this.#frame.getOffset();
    return new FrameGeometryDTO(
      image !== null,
      image ? image.getSize().getWidth() : 0,
      image ? image.getSize().getHeight() : 0,
      this.#frame.getZoom().getValue(),
      offset.getX(),
      offset.getY(),
      image ? image.getName() : ''
    );
  }
}
