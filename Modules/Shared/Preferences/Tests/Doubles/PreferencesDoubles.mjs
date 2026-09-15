/* Заглушки для тестов настроек: файлы, таблицы стилей и словари. */

import { app } from '#app';

const { PickedFileDTO, LanguageDTO, ThemeDTO } = app;

/** @implements {FileReaderInterface} */
export class FakeTextFileReader {
  #file;
  picks = 0;

  /** @param {PickedFileDTO|null} file */
  constructor(file) {
    this.#file = file;
  }

  async pick() { this.picks += 1; return this.#file; }
  async pickText() { this.picks += 1; return this.#file; }

  /** @param {string} name @param {string} text */
  static withText(name, text) {
    return new FakeTextFileReader(new PickedFileDTO(name, 'text/plain', { size: text.length }, text));
  }

  static empty() { return new FakeTextFileReader(null); }
}

/** @implements {FileWriterInterface} */
export class FakeFileWriter {
  saved = [];
  save(name, blob) { this.saved.push({ name, blob }); }
  last() { return this.saved[this.saved.length - 1] || null; }
}

/** элементы страницы, которые трогает StyleSheetGateway */
export function fakeStyleSheets() {
  const link = {
    href: null,
    getAttribute(name) { return name === 'href' ? this.href : null; },
    setAttribute(name, value) { if (name === 'href') this.href = value; }
  };
  const style = { textContent: '' };
  return { link, style };
}

export const RU = new LanguageDTO('ru', 'Русский', 'ltr', { save: 'Скачать', pcs: '{n} шт' });
export const EN = new LanguageDTO('en', 'English', 'ltr', { save: 'Download', pcs: '{n}', done: 'Done' });
export const DARK = new ThemeDTO('dark', 'themeDark', 'themes/dark.css');
export const LIGHT = new ThemeDTO('light', 'themeLight', 'themes/light.css');
