/* Внутренний порт хранения размера холста. */

/** @interface */
class CanvasRepositoryInterface {
  /** @returns {SizeVO} */
  getSize() { throw new Error('not implemented'); }
  /** @returns {string|null} id выбранного шаблона или null для своего размера */
  findPresetId() { throw new Error('not implemented'); }
  /** @param {SizeVO} size @param {string|null} preset_id */
  update(size, preset_id) { throw new Error('not implemented'); }
}

/** @type {symbol} */
const CanvasRepositoryToken = Symbol('CanvasRepositoryInterface');
