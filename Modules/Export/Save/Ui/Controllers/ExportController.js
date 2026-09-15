/* Точка входа: кнопки и поля блока «Сохранение». */

class ExportController {
  #actions;
  #view;
  #translator;
  #nodes;

  constructor(actions, view, translator, nodes) {
    this.#actions = actions;
    this.#view = view;
    this.#translator = translator;
    this.#nodes = nodes;
  }

  mount() {
    this.#view.buildFormats(format => {
      this.#actions.changeFormat.run(new ChangeExportFormatDTO(format.id));
    });

    this.#nodes.quality.oninput = () => {
      this.#actions.changeQuality.run(new ChangeExportQualityDTO(parseInt(this.#nodes.quality.value, 10) / 100));
    };

    this.#nodes.file_name.oninput = () => {
      this.#actions.rename.run(new RenameExportFileDTO(this.#nodes.file_name.value, true));
    };

    [this.#nodes.export_top, this.#nodes.export_bottom].forEach(button => {
      button.onclick = () => this.#export(button);
    });
  }

  /* Подпись возвращается переводом, а не запомненной строкой: пока висит
     «Готово», язык мог смениться. */
  /** @param {HTMLButtonElement} button */
  async #export(button) {
    const done = await this.#actions.export.run();
    if (!done) return;
    button.textContent = this.#translator.translate('done');
    setTimeout(() => { button.textContent = this.#translator.translate('save'); }, 1400);
  }
}
