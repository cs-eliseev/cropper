/* Единая точка перевода для всего приложения: берёт текущую цепочку словарей
   из репозитория и отдаёт её чистому сервису. Своей логики не имеет. */

/** @implements {TranslatorInterface} */
class TranslatorFacade {
  #languages;
  #translation;

  /** @param {LanguageRepositoryInterface} languages @param {TranslationService} translation */
  constructor(languages, translation) {
    this.#languages = languages;
    this.#translation = translation;
  }

  /** @param {string} key @param {object} [vars] @returns {string} */
  translate(key, vars) {
    return this.#translation.translate(this.#languages.getChain(), key, vars);
  }
}
