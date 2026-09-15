/* Композиционный корень модуля: сначала объявление привязок без побочных
   эффектов, потом активация — подписки, отрисовка, обработчики разметки. */

const PreferencesProvider = {
  /**
   * @param {Container} container @param {object} settings значения из config.js
   */
  register(container, settings) {
    container.set(LanguageRepositoryToken, c => new LanguageRepository(
      c.get(KeyValueStorageToken),
      settings.languages,
      settings.fallback_lang,
      settings.lang
    ));

    container.set(ThemeRepositoryToken, c => new ThemeRepository(
      c.get(KeyValueStorageToken),
      settings.themes,
      settings.theme,
      PreferencesDictionary.CUSTOM_THEME_NAME_KEY
    ));

    container.set(TranslatorToken, c => new TranslatorFacade(
      c.get(LanguageRepositoryToken),
      new TranslationService()
    ));

    container.set(ThemeTokensToken, () => new CssTokenGateway(
      document.documentElement,
      new ThemeTokensDTO(
        PreferencesDictionary.FALLBACK_CANVAS_BG,
        PreferencesDictionary.FALLBACK_HATCH_A,
        PreferencesDictionary.FALLBACK_HATCH_B
      )
    ));
  },

  /** @param {Container} container */
  boot(container) {
    const nodes = {
      button: document.getElementById('prefsBtn'),
      popover: document.getElementById('prefs'),
      language_select: document.getElementById('langSelect'),
      language_file: document.getElementById('langFile'),
      language_template: document.getElementById('langTemplate'),
      theme_select: document.getElementById('themeSelect'),
      theme_file: document.getElementById('themeFile'),
      reset: document.getElementById('prefsReset')
    };

    const events = container.get(EventBusToken);
    const languages = container.get(LanguageRepositoryToken);
    const themes = container.get(ThemeRepositoryToken);
    const translator = container.get(TranslatorToken);
    const sheets = new StyleSheetGateway(
      document.getElementById('themeLink'),
      document.getElementById('themeStyle')
    );

    const view = new PreferencesView(languages, themes, translator, nodes);
    const staticText = new StaticTextView(translator);

    new PreferencesController({
      switchLanguage: new SwitchLanguageAction(languages, events),
      importLanguage: new ImportLanguageAction(
        container.get(FileReaderToken), languages, new LanguageFileMapper(), events
      ),
      exportTemplate: new ExportLanguageTemplateAction(languages, container.get(FileWriterToken)),
      switchTheme: new SwitchThemeAction(themes, sheets, events),
      importTheme: new ImportThemeAction(container.get(FileReaderToken), themes, sheets, events),
      reset: new ResetPreferencesAction(themes),
      view,
      translator,
      nodes
    }).mount();

    events.subscribe(LanguageChangedEvent,
      new OnLanguageChangedRenderPreferencesListener(staticText, view, languages));
    events.subscribe(ThemeChangedEvent,
      new OnThemeChangedRefreshTokensListener(container.get(ThemeTokensToken), view));

    /* первый показ: тема из настроек и строки текущего языка */
    sheets.apply(themes.getBase(), themes.getCurrent());
    staticText.render(languages.getCurrent());
    view.render();
  }
};
