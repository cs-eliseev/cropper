/* Адаптер к таблицам стилей страницы: подменяет ссылку на файл темы
   и держит наложенный css. Единственное место, которое трогает <link> и <style>. */

class StyleSheetGateway {
  #link;
  #style;

  /** @param {HTMLLinkElement} link @param {HTMLStyleElement} style */
  constructor(link, style) {
    this.#link = link;
    this.#style = style;
  }

  /**
   * @param {ThemeDTO} base тема из списка
   * @param {ThemeDTO} current выбранная: та же или наложенная файлом
   */
  apply(base, current) {
    if (this.#link.getAttribute('href') !== base.href) this.#link.setAttribute('href', base.href);
    this.#style.textContent = current.isOverlay() ? current.css : '';
  }
}
