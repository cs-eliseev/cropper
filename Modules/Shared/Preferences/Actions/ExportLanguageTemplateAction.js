/* Отдать текущий словарь файлом — заготовка для перевода. */

class ExportLanguageTemplateAction {
  #languages;
  #writer;

  /** @param {LanguageRepositoryInterface} languages @param {FileWriterInterface} writer */
  constructor(languages, writer) {
    this.#languages = languages;
    this.#writer = writer;
  }

  /** @returns {string} имя отданного файла */
  run() {
    const language = this.#languages.getCurrent();
    const text = JSON.stringify({
      code: language.code, name: language.name, dir: language.dir, strings: language.strings
    }, null, 2);
    const name = language.code + '.json';
    this.#writer.save(name, new Blob([text], { type: 'application/json;charset=utf-8' }));
    return name;
  }
}
