/* English dictionary. See lang/ru.js for the format — a language file is a
   single defineLanguage() call, and the same object without the wrapper is valid
   JSON for the ⚙ → Language → File… picker. Missing keys fall back to the
   language named in config.js. */

defineLanguage({
  code: 'en',
  name: 'English',
  strings: {
    docTitle: 'Cropper',
    appTitle: 'Cropper',
    noFile: 'no file selected',
    load: 'Load',
    save: 'Download',
    done: 'Done',
    dropHere: 'Drop an image here or click to pick a file',
    stageHint: 'Wheel — zoom · drag — move · double click — fit',
    grid: 'Grid',

    panelTitle: 'Frame',
    panelCollapse: 'Collapse panel',
    panelExpand: 'Expand panel',
    multiOn: 'Keep several open (on)',
    multiOff: 'Keep several open (off)',
    collapseAll: 'Collapse all',
    expandAll: 'Expand all',

    blockSize: 'Canvas size',
    presets: 'Presets',
    swap: 'Swap sides',
    custom: 'custom size',

    blockImage: 'Image',
    zoom: 'Zoom',
    fill: 'Fill',
    fit: 'Fit',
    center: 'Center',
    trimTitle: 'Fit canvas',
    trimVisible: 'To visible',
    trimFit: 'Fit',
    trimMatch: 'Proportional',
    trimHintEmpty: 'Pick an image to fit the canvas to it.',
    trimHintSource: 'Source {w}×{h} ({ratio}). “To visible” shrinks the canvas to what is actually shown at the current zoom.',

    blockSave: 'Export',
    quality: 'Quality',
    exportHint: 'Export is made from the original file at full resolution: only the preview is scaled down.',
    qualityOk: '{src} px of the original are used for {dst} px of output — enough headroom, no quality lost.',
    qualityBad: 'Only {src} px of the original are in frame, {dst} needed. It will be upscaled {k}× and go soft. Zoom out or use a larger photo.',

    presetAvatar: 'Avatar',
    presetAvatarMeta: '1000×1000 — square',
    presetCover: 'Cover',
    presetCoverMeta: '3000×3000 — for the distributor',
    presetCard: 'Artist card',
    presetCardMeta: '2000×2700 — portrait',
    presetStory: 'Story',
    presetStoryMeta: '1080×1920 — portrait 9:16',
    presetBanner: 'Banner',
    presetBannerMeta: '1920×1080 — landscape 16:9',

    errRead: 'Could not read the image',

    /* --- preferences, languages and themes --- */
    prefs: 'Preferences',
    langLabel: 'Language',
    themeLabel: 'Theme',
    fileBtn: 'File…',
    templateBtn: 'Template',
    resetBtn: 'Reset mine',
    themeDark: 'Dark',
    themeLight: 'Light',
    themeCustom: 'My file',
    prefsHint: 'A language is a dictionary file (.json or .js), a theme is a file of tokens (.css). What you can change without touching the code lives in config.js — see the README.',
    errLangFile: 'Could not read the dictionary: {msg}',
    errStore: 'Could not save it in the browser — the file is too big or storage is blocked. It works now but will be gone after a reload.',
  }
});
