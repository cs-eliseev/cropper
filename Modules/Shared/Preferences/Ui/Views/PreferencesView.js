/* Всплывающее окно настроек: списки языков и тем. */

class PreferencesView {
  #languages;
  #themes;
  #translator;
  #nodes;

  /**
   * @param {LanguageRepositoryInterface} languages @param {ThemeRepositoryInterface} themes
   * @param {TranslatorInterface} translator @param {object} nodes элементы разметки
   */
  constructor(languages, themes, translator, nodes) {
    this.#languages = languages;
    this.#themes = themes;
    this.#translator = translator;
    this.#nodes = nodes;
  }

  render() {
    this.#fill(this.#nodes.language_select,
      this.#languages.listLanguages().map(language => ({ value: language.code, label: language.name })),
      this.#languages.getCurrent().code);
    this.#fill(this.#nodes.theme_select,
      this.#themes.listThemes().map(theme => ({ value: theme.id, label: this.#translator.translate(theme.name) })),
      this.#themes.getCurrent().id);
  }

  /** @param {boolean} is_open */
  toggle(is_open) {
    const box = this.#nodes.popover;
    box.hidden = !is_open;
    if (!is_open) return;
    const anchor = this.#nodes.button.getBoundingClientRect();
    box.style.top = (anchor.bottom + 8) + 'px';
    box.style.left = Math.max(8, Math.min(
      window.innerWidth - box.offsetWidth - 8, anchor.right - box.offsetWidth
    )) + 'px';
  }

  isOpen() { return !this.#nodes.popover.hidden; }

  /** @param {HTMLSelectElement} select @param {Array<{value: string, label: string}>} items @param {string} current */
  #fill(select, items, current) {
    select.innerHTML = '';
    items.forEach(item => {
      const option = document.createElement('option');
      option.value = item.value;
      option.textContent = item.label;
      select.appendChild(option);
    });
    select.value = current;
  }
}
