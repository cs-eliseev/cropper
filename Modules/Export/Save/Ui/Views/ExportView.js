/* Блок панели «Сохранение»: формат, качество, имя файла и заметка о запасе. */

class ExportView {
  #settings;
  #canvas;
  #frame;
  #quality;
  #translator;
  #nodes;

  /**
   * @param {ExportSettingsRepositoryInterface} settings @param {GetCanvasSizeInterface} canvas
   * @param {GetFrameGeometryInterface} frame @param {QualityEstimateService} quality
   * @param {TranslatorInterface} translator @param {object} nodes
   */
  constructor(settings, canvas, frame, quality, translator, nodes) {
    this.#settings = settings;
    this.#canvas = canvas;
    this.#frame = frame;
    this.#quality = quality;
    this.#translator = translator;
    this.#nodes = nodes;
  }

  /** @param {(format: ExportFormatDTO) => void} onPick */
  buildFormats(onPick) {
    const host = this.#nodes.formats;
    host.innerHTML = '';
    this.#settings.listFormats().forEach(format => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn--chip';
      button.dataset.format = format.id;
      button.textContent = format.id;
      button.onclick = () => onPick(format);
      host.appendChild(button);
    });
  }

  render() {
    const current = this.#settings.getSettings();
    const format = this.#settings.getFormat();

    [...this.#nodes.formats.children].forEach(button => {
      button.classList.toggle('btn--on', button.dataset.format === format.id);
    });

    this.#nodes.summary.textContent = format.id;
    this.#nodes.quality_row.hidden = !format.uses_quality;
    this.#nodes.quality_value.textContent = Math.round(current.quality * 100);
    if (document.activeElement !== this.#nodes.quality) {
      this.#nodes.quality.value = Math.round(current.quality * 100);
    }
    if (document.activeElement !== this.#nodes.file_name) this.#nodes.file_name.value = current.file_name;

    this.#renderQualityHint();
  }

  #renderQualityHint() {
    const geometry = this.#frame.run();
    const hint = this.#nodes.quality_hint;
    if (!geometry.has_image) {
      hint.textContent = '';
      hint.className = 'hint';
      return;
    }
    const estimate = this.#quality.estimate(
      this.#canvas.run().toSize(),
      new SizeVO(geometry.image_width, geometry.image_height),
      new ZoomVO(geometry.zoom)
    );
    hint.className = estimate.is_enough ? 'hint' : 'hint hint--warn';
    hint.textContent = estimate.is_enough
      ? this.#translator.translate('qualityOk', { src: estimate.source_px, dst: estimate.target_px })
      : this.#translator.translate('qualityBad', {
          src: estimate.source_px, dst: estimate.target_px, k: estimate.upscale.toFixed(2)
        });
  }
}
