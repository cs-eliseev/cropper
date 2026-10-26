/* Настройки инструмента — единственный файл, который стоит править,
   чтобы подогнать Cropper под себя. Код трогать не нужно.

   Значения отсюда попадают в модули через конструкторы: композиционный корень
   (main.js) раздаёт их при сборке. Внутри модулей конфигурация не читается —
   поэтому любое поле можно поменять здесь и не искать его в коде. */

const CROPPER_CONFIG = Object.freeze({
  /* префикс ключей в localStorage: file:// делит хранилище между страницами */
  storage_prefix: 'cropper',

  /* Язык: 'auto' — по языку браузера, иначе код словаря ('ru', 'en', свой).
     Выбор пользователя в ⚙ сильнее этой настройки. */
  lang: 'auto',
  fallback_lang: 'en',

  /* Тема из списка themes. Пользовательский выбор тоже сильнее. */
  theme: 'dark',
  themes: [
    { id: 'dark', name: 'themeDark', href: 'themes/dark.css' },
    { id: 'light', name: 'themeLight', href: 'themes/light.css' }
  ],

  /* Блоки панели: порядок, что спрятать, что раскрыть при первом запуске.
     Имена блоков — те же, что в разметке (data-block). */
  panel_blocks: ['size', 'frame', 'save'],
  panel_hidden_blocks: [],
  panel_open_blocks: ['size', 'frame'],

  /* Шаблоны холста. Свой пункт — просто ещё один объект в списке;
     label и meta — ключи словаря либо готовый текст. */
  canvas_presets: [
    { id: 'avatar', width: 1000, height: 1000, label: 'presetAvatar', meta: 'presetAvatarMeta' },
    { id: 'cover', width: 3000, height: 3000, label: 'presetCover', meta: 'presetCoverMeta' },
    { id: 'card', width: 2000, height: 2700, label: 'presetCard', meta: 'presetCardMeta' },
    { id: 'story', width: 1080, height: 1920, label: 'presetStory', meta: 'presetStoryMeta' },
    { id: 'banner', width: 1920, height: 1080, label: 'presetBanner', meta: 'presetBannerMeta' },
    { id: 'yandex-photo', width: 3000, height: 4035, label: 'presetYandexPhoto', meta: 'presetYandexPhotoMeta' },
    { id: 'yandex-photo-min', width: 1000, height: 1345, label: 'presetYandexPhotoMin', meta: 'presetYandexPhotoMinMeta' },
    { id: 'vk-cover-mobile', width: 1500, height: 1120, label: 'presetVkCoverMobile', meta: 'presetVkCoverMobileMeta' },
    { id: 'vk-cover-web', width: 1820, height: 458, label: 'presetVkCoverWeb', meta: 'presetVkCoverWebMeta' },
    { id: 'zvuk-avatar', width: 3000, height: 3000, label: 'presetZvukAvatar', meta: 'presetZvukAvatarMeta' },
    { id: 'zvuk-banner', width: 1800, height: 1000, label: 'presetZvukBanner', meta: 'presetZvukBannerMeta' }
  ],
  canvas_preset_index: 1,

  /* Форматы экспорта. supports_alpha — умеет ли формат прозрачность,
     uses_quality — учитывает ли степень сжатия (у PNG её нет). */
  export_formats: [
    { id: 'JPEG', mime: 'image/jpeg', extension: 'jpg', supports_alpha: false, uses_quality: true },
    { id: 'PNG', mime: 'image/png', extension: 'png', supports_alpha: true, uses_quality: false },
    { id: 'WEBP', mime: 'image/webp', extension: 'webp', supports_alpha: true, uses_quality: true }
  ],
  quality: 0.94,

  /* Чем заливается холст там, где картинки нет. Это часть результата,
     а не оформления, поэтому цвет живёт здесь, а не в теме. */
  matte: '#000000',

  grid: true,
  /* Имя файла: {name} — имя исходной картинки без расширения,
     {w}×{h} — размер холста. Пока картинки нет, {name} = out_name_fallback. */
  out_name_pattern: '{name}-{w}x{h}.{ext}',
  out_name_fallback: 'cover',
  preview_max: 1400
});
