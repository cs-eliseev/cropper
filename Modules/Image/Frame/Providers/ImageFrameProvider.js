/* Композиционный корень модуля «Кадр». */

const ImageFrameProvider = {
  /** @param {Container} container @param {object} settings */
  register(container, settings) {
    container.set(FrameRepositoryToken, c => new FrameRepository(
      c.get(KeyValueStorageToken), settings.grid
    ));

    container.set(ImageDecoderToken, () => new ImageDecodeGateway());

    container.set(GetFrameGeometryToken, c => new GetFrameGeometryAction(c.get(FrameRepositoryToken)));

    container.set(RenderFrameToken, c => new RenderFrameAction(
      c.get(FrameRepositoryToken),
      c.get(GetCanvasSizeToken),
      new FrameGeometryService(),
      new CanvasPainterGateway(),
      c.get(ThemeTokensToken)
    ));
  },

  /** @param {Container} container @param {object} settings */
  boot(container, settings) {
    const nodes = {
      area: document.querySelector('.stage__area'),
      box: document.getElementById('canvas'),
      canvas: document.getElementById('cv'),
      drop: document.getElementById('drop'),
      pick: document.getElementById('pick'),
      badge_zoom: document.getElementById('badgeZoom'),
      file_name: document.getElementById('fileName'),
      file_dot: document.getElementById('fileDot'),
      zoom: document.getElementById('zoom'),
      zoom_value: document.getElementById('zoomVal'),
      fill: document.getElementById('fill'),
      fit: document.getElementById('fit'),
      center: document.getElementById('center'),
      trim_visible: document.getElementById('trimVisible'),
      trim_fit: document.getElementById('trimFit'),
      trim_match: document.getElementById('trimMatch'),
      hint: document.getElementById('trimHint'),
      grid: document.getElementById('grid'),
      grid_button: document.getElementById('gridBtn'),
      summary: document.querySelector('[data-summary="frame"]')
    };

    const events = container.get(EventBusToken);
    const frame = container.get(FrameRepositoryToken);
    const canvas = container.get(GetCanvasSizeToken);
    const resize = container.get(ResizeCanvasToken);
    const geometry = new FrameGeometryService();
    const translator = container.get(TranslatorToken);

    const preview = new FramePreviewView(
      container.get(RenderFrameToken), canvas, container.get(GetFrameGeometryToken),
      frame, settings.preview_max, settings.matte, nodes
    );
    const panel = new FrameSettingsView(container.get(GetFrameGeometryToken), canvas, translator, nodes);

    new FrameController({
      load: new LoadImageAction(
        container.get(FileReaderToken), container.get(ImageDecoderToken), frame, events
      ),
      zoom: new ZoomImageAction(frame, canvas, geometry, events),
      move: new MoveImageAction(frame, canvas, geometry, events),
      fit: new FitImageAction(frame, canvas, geometry, events),
      fill: new FillImageAction(frame, events),
      center: new CenterImageAction(frame, events),
      trimVisible: new TrimCanvasToVisibleAction(frame, canvas, resize, geometry, events),
      trimFit: new FitCanvasToImageAction(frame, canvas, resize, geometry, events),
      trimMatch: new MatchCanvasToImageAction(frame, canvas, resize, geometry, events),
      toggleGrid: new ToggleFramingGridAction(frame, events)
    }, container.get(GetFrameGeometryToken), translator, nodes).mount();

    const subscriber = new FrameEventSubscriber(preview, panel);
    [ImageLoadedEvent, FrameChangedEvent, CanvasResizedEvent, ThemeChangedEvent,
     LanguageChangedEvent, FramingGridToggledEvent]
      .forEach(event => events.subscribe(event, subscriber));

    window.addEventListener('resize', () => preview.render());

    preview.render();
    panel.render();
  }
};
