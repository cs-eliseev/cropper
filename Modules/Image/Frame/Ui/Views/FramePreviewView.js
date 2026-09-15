/* Превью кадра на экране: держит размер канваса под область и просит
   модуль нарисовать себя. Разрешение превью урезано — экспорт от этого
   не зависит, он идёт в полном размере холста. */

class FramePreviewView {
  #render;
  #canvas;
  #frame;
  #repository;
  #preview_max;
  #matte;
  #nodes;

  /**
   * @param {RenderFrameInterface} render @param {GetCanvasSizeInterface} canvas
   * @param {GetFrameGeometryInterface} frame @param {FrameRepositoryInterface} repository
   * @param {number} preview_max @param {string} matte @param {object} nodes
   */
  constructor(render, canvas, frame, repository, preview_max, matte, nodes) {
    this.#render = render;
    this.#canvas = canvas;
    this.#frame = frame;
    this.#repository = repository;
    this.#preview_max = preview_max;
    this.#matte = matte;
    this.#nodes = nodes;
    if (window.ResizeObserver) {
      new ResizeObserver(() => this.#fitToArea()).observe(this.#nodes.area);
    }
  }

  render() {
    const size = this.#canvas.run();
    const geometry = this.#frame.run();
    const long = Math.max(size.width, size.height);
    const scale = long > this.#preview_max ? this.#preview_max / long : 1;
    const width = Math.max(1, Math.round(size.width * scale));
    const height = Math.max(1, Math.round(size.height * scale));

    const element = this.#nodes.canvas;
    if (element.width !== width || element.height !== height) {
      element.width = width;
      element.height = height;
    }
    this.#fitToArea();

    this.#render.run(new RenderFrameDTO(
      element.getContext('2d'), width, height, geometry.has_image ? this.#matte : null
    ));

    this.#nodes.badge_zoom.textContent = Math.round(geometry.zoom * 100) + '%';
    this.#nodes.drop.hidden = geometry.has_image;
    this.#nodes.box.classList.toggle('canvas--ready', geometry.has_image);
    this.#nodes.file_name.textContent = geometry.has_image ? geometry.image_name : this.#nodes.file_name.textContent;
    this.#nodes.file_dot.classList.toggle('head__dot--empty', !geometry.has_image);

    const is_grid_visible = this.#repository.isGridVisible();
    this.#nodes.grid.hidden = !is_grid_visible;
    this.#nodes.grid_button.classList.toggle('btn--on', is_grid_visible);
  }

  /* Канвас вписывается в свободную область целиком: у него свои пропорции,
     поэтому ограничиваем его пикселями области. */
  #fitToArea() {
    const area = this.#nodes.area;
    const style = getComputedStyle(area);
    const pad_x = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const pad_y = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    const width = Math.max(80, area.clientWidth - pad_x - 2) + 'px';
    const height = Math.max(80, area.clientHeight - pad_y - 2) + 'px';
    if (this.#nodes.canvas.style.maxWidth !== width) this.#nodes.canvas.style.maxWidth = width;
    if (this.#nodes.canvas.style.maxHeight !== height) this.#nodes.canvas.style.maxHeight = height;
  }
}
