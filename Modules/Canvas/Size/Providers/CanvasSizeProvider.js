/* Композиционный корень модуля «Размер холста». */

const CanvasSizeProvider = {
  /** @param {Container} container @param {object} settings */
  register(container, settings) {
    container.set(CanvasRepositoryToken, c => new CanvasRepository(
      c.get(KeyValueStorageToken),
      SizeVO.clamped(settings.canvas_presets[settings.canvas_preset_index].width,
                     settings.canvas_presets[settings.canvas_preset_index].height),
      settings.canvas_presets[settings.canvas_preset_index].id
    ));

    container.set(GetCanvasSizeToken, c => new GetCanvasSizeAction(c.get(CanvasRepositoryToken)));

    container.set(ResizeCanvasToken, c => new ResizeCanvasAction(
      new StoreCanvasSizeInteractor(c.get(CanvasRepositoryToken)),
      c.get(EventBusToken)
    ));
  },

  /** @param {Container} container @param {object} settings */
  boot(container, settings) {
    const nodes = {
      width: document.getElementById('cw'),
      height: document.getElementById('ch'),
      swap: document.getElementById('swap'),
      presets: document.getElementById('presets'),
      header_size: document.getElementById('headSize'),
      badge_size: document.getElementById('badgeSize'),
      summary: document.querySelector('[data-summary="size"]')
    };

    const events = container.get(EventBusToken);
    const canvas = container.get(CanvasRepositoryToken);
    const store = new StoreCanvasSizeInteractor(canvas);
    const applyPreset = new ApplyCanvasPresetAction(store, events, settings.canvas_presets);
    const view = new CanvasSizeView(canvas, container.get(TranslatorToken), settings.canvas_presets, nodes);
    const pick = preset => applyPreset.run(new ApplyCanvasPresetDTO(preset.id));

    new CanvasSizeController({
      resize: container.get(ResizeCanvasToken),
      applyPreset,
      swap: new SwapCanvasSidesAction(canvas, store, events),
      view,
      nodes
    }).mount();

    events.subscribe(CanvasResizedEvent, new OnCanvasResizedRenderSizeListener(view));
    events.subscribe(LanguageChangedEvent, new OnLanguageChangedRenderSizeListener(view, pick));

    view.render();
  }
};
