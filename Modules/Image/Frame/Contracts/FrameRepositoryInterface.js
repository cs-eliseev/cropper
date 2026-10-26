/* Внутренний порт: текущая картинка, приближение, положение и область обрезки. */

/** @interface */
class FrameRepositoryInterface {
  /** @returns {SourceImageVO|null} */
  findImage() { throw new Error('not implemented'); }
  /** @returns {ZoomVO} */
  getZoom() { throw new Error('not implemented'); }
  /** @returns {OffsetVO} */
  getOffset() { throw new Error('not implemented'); }
  /** @param {SourceImageVO} image @param {ZoomVO} zoom */
  updateImage(image, zoom) { throw new Error('not implemented'); }
  /** @param {ZoomVO} zoom @param {OffsetVO} offset */
  updateFrame(zoom, offset) { throw new Error('not implemented'); }
  /** @returns {DrawRectDTO|null} */
  findCrop() { throw new Error('not implemented'); }
  /** @param {DrawRectDTO|null} area */
  updateCrop(area) { throw new Error('not implemented'); }
  /** @returns {boolean} */
  isGridVisible() { throw new Error('not implemented'); }
  /** @param {boolean} is_visible */
  updateGrid(is_visible) { throw new Error('not implemented'); }
}

/** @type {symbol} */
const FrameRepositoryToken = Symbol('FrameRepositoryInterface');
