/* Точка входа: заголовки блоков и кнопки шапки панели. */

class PanelController {
  #actions;
  #nodes;

  constructor(actions, nodes) {
    this.#actions = actions;
    this.#nodes = nodes;
  }

  mount() {
    this.#nodes.body.querySelectorAll('.block__head').forEach(head => {
      head.onclick = () => this.#actions.toggleBlock.run(new ToggleBlockDTO(head.parentElement.dataset.block));
    });

    this.#nodes.toggle.onclick = () => this.#actions.togglePanel.run();

    this.#nodes.mode.onclick = () => {
      const next = this.#nodes.mode.classList.contains('btn--on') ? 'single' : 'multi';
      this.#actions.setMode.run(new SetAccordionModeDTO(next));
    };

    this.#nodes.all.onclick = () => this.#actions.toggleAll.run();
  }
}
