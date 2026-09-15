/* Взять размер из шаблона. Шаблоны приходят из config.js при сборке модуля. */

class ApplyCanvasPresetAction {
  #store;
  #events;
  #presets;

  /** @param {StoreCanvasSizeInteractor} store @param {EventBus} events @param {CanvasPresetDTO[]} presets */
  constructor(store, events, presets) {
    this.#store = store;
    this.#events = events;
    this.#presets = presets;
  }

  /** @param {ApplyCanvasPresetDTO} dto @returns {CanvasSizeDTO|null} null — такого шаблона нет */
  run(dto) {
    const preset = this.#presets.find(item => item.id === dto.preset_id);
    if (!preset) return null;
    const result = this.#store.execute(SizeVO.clamped(preset.width, preset.height), preset.id);
    this.#events.publish(new CanvasResizedEvent(result.width, result.height, result.preset_id));
    return result;
  }
}
