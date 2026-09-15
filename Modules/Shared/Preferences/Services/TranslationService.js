/* Чистая логика перевода: выбрать строку по цепочке словарей и подставить
   значения. Ни хранилища, ни DOM — только вход и выход. */

class TranslationService {
  /**
   * @param {LanguageDTO[]} chain словари в порядке предпочтения
   * @param {string} key
   * @param {object} [vars]
   * @returns {string} строка или сам ключ, если её нет нигде
   */
  translate(chain, key, vars) {
    let found;
    for (const language of chain) {
      if (language && language.strings[key] !== undefined) { found = language.strings[key]; break; }
    }
    if (found === undefined) return key;
    if (!vars) return found;
    return Object.keys(vars).reduce((text, name) => text.split('{' + name + '}').join(vars[name]), found);
  }
}
