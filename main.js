/* Композиционный корень приложения: превращает config.js в значения для
   конструкторов и поднимает модули. Единственное место, которое знает
   и про настройки, и про список модулей. */

Bootstrap.run(
  {
    storage_prefix: CROPPER_CONFIG.storage_prefix,

    lang: CROPPER_CONFIG.lang,
    fallback_lang: CROPPER_CONFIG.fallback_lang,
    languages: LANGUAGE_DEFINITIONS.map(definition => new LanguageDTO(
      definition.code, definition.name, definition.dir, definition.strings
    )),

    theme: CROPPER_CONFIG.theme,
    themes: CROPPER_CONFIG.themes.map(theme => new ThemeDTO(theme.id, theme.name, theme.href)),

    panel_blocks: CROPPER_CONFIG.panel_blocks.filter(
      id => CROPPER_CONFIG.panel_hidden_blocks.indexOf(id) < 0
    ),
    panel_open_blocks: CROPPER_CONFIG.panel_open_blocks,

    canvas_presets: CROPPER_CONFIG.canvas_presets.map(preset => new CanvasPresetDTO(
      preset.id, preset.width, preset.height, preset.label, preset.meta
    )),
    canvas_preset_index: CROPPER_CONFIG.canvas_preset_index,

    export_formats: CROPPER_CONFIG.export_formats.map(format => new ExportFormatDTO(
      format.id, format.mime, format.extension, format.supports_alpha, format.uses_quality
    )),
    quality: CROPPER_CONFIG.quality,
    matte: CROPPER_CONFIG.matte,
    grid: CROPPER_CONFIG.grid,
    out_name_pattern: CROPPER_CONFIG.out_name_pattern,
    preview_max: CROPPER_CONFIG.preview_max
  },
  [
    PreferencesProvider,   /* первым: тема и строки нужны остальным при первой отрисовке */
    PanelProvider,
    CanvasSizeProvider,
    ImageFrameProvider,
    ExportSaveProvider
  ]
);
