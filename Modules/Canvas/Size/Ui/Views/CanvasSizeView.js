/* Адаптер вывода: поля размера, список шаблонов, заголовок блока и подпись в шапке. */

class CanvasSizeView {
  #canvas;
  #translator;
  #presets;
  #nodes;

  /**
   * @param {CanvasRepositoryInterface} canvas @param {TranslatorInterface} translator
   * @param {CanvasPresetDTO[]} presets @param {object} nodes
   */
  constructor(canvas, translator, presets, nodes) {
    this.#canvas = canvas;
    this.#translator = translator;
    this.#presets = presets;
    this.#nodes = nodes;
  }

  /** @param {(preset: CanvasPresetDTO) => void} onPick */
  buildPresets(onPick) {
    const host = this.#nodes.presets;
    host.innerHTML = '';
    this.#presets.forEach(preset => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'preset';
      button.dataset.preset = preset.id;
      button.innerHTML = '<span class="preset__label"></span><span class="preset__meta"></span>';
      button.querySelector('.preset__label').textContent = this.#translator.translate(preset.label);
      button.querySelector('.preset__meta').textContent = this.#translator.translate(preset.meta);
      button.onclick = () => onPick(preset);
      host.appendChild(button);
    });
  }

  render() {
    const size = this.#canvas.getSize();
    const preset_id = this.#canvas.findPresetId();
    const preset = this.#presets.find(item => item.id === preset_id);

    this.#nodes.header_size.textContent = size.toString();
    this.#nodes.badge_size.textContent = size.toString();
    this.#nodes.summary.textContent = preset
      ? this.#translator.translate(preset.label)
      : this.#translator.translate('custom');

    if (document.activeElement !== this.#nodes.width) this.#nodes.width.value = size.getWidth();
    if (document.activeElement !== this.#nodes.height) this.#nodes.height.value = size.getHeight();

    [...this.#nodes.presets.children].forEach(button => {
      button.classList.toggle('preset--on', button.dataset.preset === preset_id);
    });
  }
}
