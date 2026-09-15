/* Размер холста: в памяти на время работы, в хранилище — между запусками.
   Единственное место модуля, которое знает про хранилище. */

/** @implements {CanvasRepositoryInterface} */
class CanvasRepository {
  #storage;
  #size;
  #preset_id;

  /**
   * @param {KeyValueStorageInterface} storage
   * @param {SizeVO} fallback размер из config.js
   * @param {string|null} fallback_preset_id
   */
  constructor(storage, fallback, fallback_preset_id) {
    this.#storage = storage;
    const saved = storage.get('canvas');
    if (saved && saved.width && saved.height) {
      this.#size = SizeVO.clamped(saved.width, saved.height);
      this.#preset_id = saved.preset_id || null;
    } else {
      this.#size = fallback;
      this.#preset_id = fallback_preset_id;
    }
  }

  /** @returns {SizeVO} */
  getSize() { return this.#size; }

  /** @returns {string|null} */
  findPresetId() { return this.#preset_id; }

  /** @param {SizeVO} size @param {string|null} preset_id */
  update(size, preset_id) {
    this.#size = size;
    this.#preset_id = preset_id;
    this.#storage.set('canvas', {
      width: size.getWidth(), height: size.getHeight(), preset_id: preset_id
    });
  }
}
