/* Панель и её блоки: порядок, видимость, раскрытие, подписи кнопок. */

class PanelView {
  #panel;
  #translator;
  #nodes;

  /** @param {PanelRepositoryInterface} panel @param {TranslatorInterface} translator @param {object} nodes */
  constructor(panel, translator, nodes) {
    this.#panel = panel;
    this.#translator = translator;
    this.#nodes = nodes;
  }

  /* Порядок и состав блоков задаёт config.js: переставляем разметку под него,
     лишнее прячем. */
  arrange() {
    const blocks = this.#panel.listBlocks();
    blocks.forEach(id => {
      const box = this.#nodes.body.querySelector('[data-block="' + id + '"]');
      if (box) this.#nodes.body.appendChild(box);
    });
    this.#nodes.body.querySelectorAll('[data-block]').forEach(box => {
      box.hidden = blocks.indexOf(box.dataset.block) < 0;
    });
  }

  render() {
    const state = this.#panel.getState();
    const t = key => this.#translator.translate(key);

    this.#nodes.panel.classList.toggle('panel--closed', !state.is_open);
    this.#nodes.body.hidden = !state.is_open;
    this.#nodes.title.hidden = !state.is_open;
    this.#nodes.mode.hidden = !state.is_open;
    this.#nodes.all.hidden = !state.is_open;

    this.#nodes.toggle.textContent = state.is_open ? '›' : '‹';
    this.#nodes.toggle.title = t(state.is_open ? 'panelCollapse' : 'panelExpand');

    this.#nodes.mode.classList.toggle('btn--on', state.mode === 'multi');
    this.#nodes.mode.title = t(state.mode === 'multi' ? 'multiOn' : 'multiOff');

    const has_open = state.open_blocks.length > 0;
    this.#nodes.all.textContent = has_open ? '⌃' : '⌄';
    this.#nodes.all.title = t(has_open ? 'collapseAll' : 'expandAll');

    this.#panel.listBlocks().forEach(id => {
      const box = this.#nodes.body.querySelector('[data-block="' + id + '"]');
      if (!box) return;
      const is_open = state.isBlockOpen(id);
      box.classList.toggle('block--open', is_open);
      box.querySelector('.block__mark').textContent = is_open ? '−' : '+';
      box.querySelector('.block__body').hidden = !is_open;
    });
  }
}
