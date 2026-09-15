/* Что сейчас в кадре: картинка живёт только на время работы страницы,
   приближение и положение — тоже. Между запусками сохранять нечего:
   без картинки они бессмысленны. */

/** @implements {FrameRepositoryInterface} */
class FrameRepository {
  #storage;
  #image = null;
  #zoom = ZoomVO.fill();
  #offset = OffsetVO.centered();
  #is_grid_visible;

  /** @param {KeyValueStorageInterface} storage @param {boolean} grid_by_default */
  constructor(storage, grid_by_default) {
    this.#storage = storage;
    const saved = storage.get('grid');
    this.#is_grid_visible = typeof saved === 'boolean' ? saved : grid_by_default;
  }

  /** @returns {SourceImageVO|null} */
  findImage() { return this.#image; }

  /** @returns {ZoomVO} */
  getZoom() { return this.#zoom; }

  /** @returns {OffsetVO} */
  getOffset() { return this.#offset; }

  /** @param {SourceImageVO} image новая картинка сбрасывает кадр в исходное */
  updateImage(image) {
    this.#image = image;
    this.#zoom = ZoomVO.fill();
    this.#offset = OffsetVO.centered();
  }

  /** @param {ZoomVO} zoom @param {OffsetVO} offset */
  updateFrame(zoom, offset) {
    this.#zoom = zoom;
    this.#offset = offset;
  }

  /** @returns {boolean} видна ли сетка третей */
  isGridVisible() { return this.#is_grid_visible; }

  /** @param {boolean} is_visible */
  updateGrid(is_visible) {
    this.#is_grid_visible = is_visible;
    this.#storage.set('grid', is_visible);
  }
}
