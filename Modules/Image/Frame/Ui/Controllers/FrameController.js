/* Точка входа: мышь, колесо, перетаскивание файла и кнопки блока.
   Каждый обработчик собирает DTO и зовёт ровно одно действие. */

class FrameController {
  #actions;
  #geometry;
  #translator;
  #nodes;
  #drag = null;

  /**
   * @param {object} actions действия модуля
   * @param {GetFrameGeometryInterface} geometry
   * @param {TranslatorInterface} translator
   * @param {object} nodes
   */
  constructor(actions, geometry, translator, nodes) {
    this.#actions = actions;
    this.#geometry = geometry;
    this.#translator = translator;
    this.#nodes = nodes;
  }

  mount() {
    this.#mountPointer();
    this.#mountFiles();
    this.#mountPanel();
  }

  #mountPointer() {
    const box = this.#nodes.box;
    const canvas = this.#nodes.canvas;

    box.addEventListener('pointerdown', event => {
      if (!this.#geometry.run().has_image) return;
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const frame = this.#geometry.run();
      this.#drag = {
        x: event.clientX, y: event.clientY, width: rect.width, height: rect.height,
        from_x: frame.offset_x, from_y: frame.offset_y
      };
      box.classList.add('canvas--drag');
      box.setPointerCapture(event.pointerId);
    });

    box.addEventListener('pointermove', event => {
      if (!this.#drag) return;
      this.#actions.move.run(new MoveImageDTO(
        this.#drag.from_x, this.#drag.from_y,
        (event.clientX - this.#drag.x) / this.#drag.width,
        (event.clientY - this.#drag.y) / this.#drag.height
      ));
    });

    ['pointerup', 'pointercancel'].forEach(name => box.addEventListener(name, () => {
      this.#drag = null;
      box.classList.remove('canvas--drag');
    }));

    box.addEventListener('wheel', event => {
      const frame = this.#geometry.run();
      if (!frame.has_image) return;
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      this.#actions.zoom.run(new ZoomImageDTO(
        frame.zoom * (event.deltaY < 0 ? 1.08 : 1 / 1.08),
        (event.clientX - rect.left) / rect.width,
        (event.clientY - rect.top) / rect.height
      ));
    }, { passive: false });

    box.addEventListener('dblclick', () => this.#actions.fit.run());
    box.addEventListener('click', () => {
      if (!this.#geometry.run().has_image) this.#load(null);
    });
  }

  #mountFiles() {
    this.#nodes.pick.onclick = () => this.#load(null);
    this.#nodes.drop.onclick = event => { event.stopPropagation(); this.#load(null); };

    ['dragenter', 'dragover'].forEach(name => document.addEventListener(name, event => {
      event.preventDefault();
      this.#nodes.box.classList.add('canvas--over');
    }));
    ['dragleave', 'drop'].forEach(name => document.addEventListener(name, event => {
      event.preventDefault();
      this.#nodes.box.classList.remove('canvas--over');
    }));
    document.addEventListener('drop', event => {
      const file = event.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        this.#load(new PickedFileDTO(file.name, file.type, file));
      }
    });

    document.addEventListener('keydown', event => {
      if (/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
      if (event.key === '0') this.#actions.fit.run();
      if (event.key === '1') this.#actions.fill.run();
    });
  }

  #mountPanel() {
    this.#nodes.zoom.oninput = () => {
      this.#actions.zoom.run(new ZoomImageDTO(parseFloat(this.#nodes.zoom.value) / 100));
    };
    this.#nodes.fill.onclick = () => this.#actions.fill.run();
    this.#nodes.fit.onclick = () => this.#actions.fit.run();
    this.#nodes.center.onclick = () => this.#actions.center.run();
    this.#nodes.trim_visible.onclick = () => this.#actions.trimVisible.run();
    this.#nodes.trim_fit.onclick = () => this.#actions.trimFit.run();
    this.#nodes.trim_match.onclick = () => this.#actions.trimMatch.run();
    this.#nodes.grid_button.onclick = () => this.#actions.toggleGrid.run();
  }

  /** @param {PickedFileDTO|null} file */
  async #load(file) {
    try {
      await this.#actions.load.run(new LoadImageDTO(file));
    } catch (error) {
      alert(this.#translator.translate('errRead'));
    }
  }
}
