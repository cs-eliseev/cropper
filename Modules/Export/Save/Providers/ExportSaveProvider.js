/* Композиционный корень модуля «Экспорт». */

const ExportSaveProvider = {
  /** @param {Container} container @param {object} settings */
  register(container, settings) {
    container.set(CanvasFactoryToken, () => new BrowserCanvasGateway());

    container.set(ExportSettingsRepositoryToken, c => new ExportSettingsRepository(
      c.get(KeyValueStorageToken), settings.export_formats, settings.quality
    ));
  },

  /** @param {Container} container @param {object} settings */
  boot(container, settings) {
    const nodes = {
      formats: document.getElementById('formats'),
      quality: document.getElementById('quality'),
      quality_value: document.getElementById('qualityVal'),
      quality_row: document.getElementById('quality').parentElement,
      quality_hint: document.getElementById('qualityHint'),
      file_name: document.getElementById('outName'),
      export_top: document.getElementById('export'),
      export_bottom: document.getElementById('export2'),
      summary: document.querySelector('[data-summary="save"]')
    };

    const events = container.get(EventBusToken);
    const repository = container.get(ExportSettingsRepositoryToken);
    const canvas = container.get(GetCanvasSizeToken);
    const frame = container.get(GetFrameGeometryToken);
    const names = new FileNameService(settings.out_name_pattern);
    const quality = new QualityEstimateService(new FrameGeometryService());
    const translator = container.get(TranslatorToken);

    const view = new ExportView(repository, canvas, frame, quality, translator, nodes);
    const suggest = new SuggestExportFileNameAction(repository, canvas, names, events);

    new ExportController({
      export: new ExportImageAction(
        repository, canvas, container.get(CanvasFactoryToken), container.get(RenderFrameToken),
        container.get(FileWriterToken), events, settings.matte
      ),
      changeFormat: new ChangeExportFormatAction(repository, names, events),
      changeQuality: new ChangeExportQualityAction(repository, events),
      rename: new RenameExportFileAction(repository, events)
    }, view, translator, nodes).mount();

    events.subscribe(CanvasResizedEvent, new OnCanvasResizedRenameFileListener(suggest));

    const subscriber = new ExportEventSubscriber(view);
    [ExportSettingsChangedEvent, CanvasResizedEvent, ImageLoadedEvent, FrameChangedEvent, LanguageChangedEvent]
      .forEach(event => events.subscribe(event, subscriber));

    suggest.run();
    view.render();
  }
};
