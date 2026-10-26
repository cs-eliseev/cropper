/* Что сейчас в кадре: картинка живёт только на время работы страницы,
   приближение, положение и область обрезки — тоже. Между запусками
   сохранять нечего: без картинки они бессмысленны. */

/** @implements {FrameRepositoryInterface} */
class FrameRepository {
  #storage;
  #image = null;
  #zoom = ZoomVO.actual();
  #offset = OffsetVO.centered();
  #crop = null;
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

  /** @param {SourceImageVO} image @param {ZoomVO} zoom новая картинка сбрасывает кадр в исходное */
  updateImage(image, zoom) {
    this.#image = image;
    this.#zoom = zoom;
    this.#offset = OffsetVO.centered();
    this.#crop = null;
  }

  /** @param {ZoomVO} zoom @param {OffsetVO} offset */
  updateFrame(zoom, offset) {
    this.#zoom = zoom;
    this.#offset = offset;
  }

  /** @returns {DrawRectDTO|null} выделенная область в единицах холста; null — обрезка не начата */
  findCrop() { return this.#crop; }

  /** @param {DrawRectDTO|null} area */
  updateCrop(area) { this.#crop = area; }

  /** @returns {boolean} видна ли сетка третей */
  isGridVisible() { return this.#is_grid_visible; }

  /** @param {boolean} is_visible */
  updateGrid(is_visible) {
    this.#is_grid_visible = is_visible;
    this.#storage.set('grid', is_visible);
  }
}
