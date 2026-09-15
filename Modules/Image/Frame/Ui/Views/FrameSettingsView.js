/* Блок панели «Изображение»: ползунок приближения, кнопки и подсказка. */

class FrameSettingsView {
  #frame;
  #canvas;
  #translator;
  #nodes;

  /**
   * @param {GetFrameGeometryInterface} frame @param {GetCanvasSizeInterface} canvas
   * @param {TranslatorInterface} translator @param {object} nodes
   */
  constructor(frame, canvas, translator, nodes) {
    this.#frame = frame;
    this.#canvas = canvas;
    this.#translator = translator;
    this.#nodes = nodes;
  }

  render() {
    const geometry = this.#frame.run();
    const percent = Math.round(geometry.zoom * 100);

    this.#nodes.zoom_value.textContent = percent + '%';
    this.#nodes.summary.textContent = percent + '%';
    if (document.activeElement !== this.#nodes.zoom) this.#nodes.zoom.value = percent;

    this.#nodes.hint.textContent = geometry.has_image
      ? this.#translator.translate('trimHintSource', {
          w: geometry.image_width,
          h: geometry.image_height,
          ratio: this.#ratio(geometry.image_width, geometry.image_height)
        })
      : this.#translator.translate('trimHintEmpty');
  }

  /** @param {number} width @param {number} height */
  #ratio(width, height) {
    const gcd = (a, b) => (b ? gcd(b, a % b) : a);
    const divisor = gcd(width, height) || 1;
    return (width / divisor) + ':' + (height / divisor);
  }
}
