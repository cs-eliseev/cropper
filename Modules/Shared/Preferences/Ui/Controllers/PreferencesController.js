/* Точка входа: события разметки → DTO → одно действие.
   Логики здесь нет, ошибки показываются пользователем текстом из словаря. */

class PreferencesController {
  #switchLanguage;
  #importLanguage;
  #exportTemplate;
  #switchTheme;
  #importTheme;
  #reset;
  #view;
  #translator;
  #nodes;

  /* eslint-disable-next-line max-params */
  constructor(deps) {
    this.#switchLanguage = deps.switchLanguage;
    this.#importLanguage = deps.importLanguage;
    this.#exportTemplate = deps.exportTemplate;
    this.#switchTheme = deps.switchTheme;
    this.#importTheme = deps.importTheme;
    this.#reset = deps.reset;
    this.#view = deps.view;
    this.#translator = deps.translator;
    this.#nodes = deps.nodes;
  }

  mount() {
    const nodes = this.#nodes;

    nodes.button.onclick = () => this.#view.toggle(!this.#view.isOpen());

    nodes.language_select.onchange = () => {
      this.#switchLanguage.run(new SwitchLanguageDTO(nodes.language_select.value));
    };

    nodes.language_file.onclick = async () => {
      try {
        const result = await this.#importLanguage.run();
        if (result && !result.is_stored) alert(this.#translator.translate('errStore'));
      } catch (error) {
        alert(this.#translator.translate('errLangFile', { msg: error.reason || error.message }));
      }
    };

    nodes.language_template.onclick = () => this.#exportTemplate.run();

    nodes.theme_select.onchange = () => {
      this.#switchTheme.run(new SwitchThemeDTO(nodes.theme_select.value));
    };

    nodes.theme_file.onclick = () => this.#importTheme.run(PreferencesDictionary.CUSTOM_THEME_NAME_KEY);

    nodes.reset.onclick = () => this.#reset.run();

    document.addEventListener('click', event => {
      if (!this.#view.isOpen()) return;
      if (event.target.closest('.prefs') || event.target.closest('#prefsBtn')) return;
      this.#view.toggle(false);
    });
  }
}
