/* Точка входа: мышь, колесо, перетаскивание файла и кнопки блока.
   Каждый обработчик собирает DTO и зовёт ровно одно действие.
   Пока открыта рамка обрезки, мышь работает с рамкой, а не с картинкой. */

/* стрелка → куда двигать картинку: [x, y] */
const KEY_ARROWS = Object.freeze({
  ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1]
});

class FrameController {
  #actions;
  #geometry;
  #crop;
  #translator;
  #nodes;
  #drag = null;

  /**
   * @param {object} actions действия модуля
   * @param {GetFrameGeometryInterface} geometry
   * @param {GetCropAreaAction} crop
   * @param {TranslatorInterface} translator
   * @param {object} nodes
   */
  constructor(actions, geometry, crop, translator, nodes) {
    this.#actions = actions;
    this.#geometry = geometry;
    this.#crop = crop;
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
      const area = this.#crop.run();
      const gesture = { x: event.clientX, y: event.clientY, width: rect.width, height: rect.height };
      if (area.is_active) {
        this.#drag = Object.assign(gesture, this.#cropGrip(event, rect, area));
      } else {
        const frame = this.#geometry.run();
        this.#drag = Object.assign(gesture, { handle: null, from_x: frame.offset_x, from_y: frame.offset_y });
        box.classList.add('canvas--drag');
      }
      box.setPointerCapture(event.pointerId);
    });

    box.addEventListener('pointermove', event => {
      if (!this.#drag) return;
      const dx_ratio = (event.clientX - this.#drag.x) / this.#drag.width;
      const dy_ratio = (event.clientY - this.#drag.y) / this.#drag.height;
      if (this.#drag.handle) {
        this.#actions.changeCrop.run(new ChangeCropDTO(
          this.#drag.handle, this.#drag.from_x, this.#drag.from_y,
          this.#drag.from_width, this.#drag.from_height, dx_ratio, dy_ratio, event.shiftKey
        ));
        return;
      }
      this.#actions.move.run(new MoveImageDTO(this.#drag.from_x, this.#drag.from_y, dx_ratio, dy_ratio));
    });

    ['pointerup', 'pointercancel'].forEach(name => box.addEventListener(name, () => {
      this.#drag = null;
      box.classList.remove('canvas--drag');
    }));

    box.addEventListener('wheel', event => {
      const frame = this.#geometry.run();
      if (!frame.has_image || this.#crop.run().is_active) return;
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      this.#actions.zoom.run(new ZoomImageDTO(
        frame.zoom * (event.deltaY < 0 ? 1.08 : 1 / 1.08),
        (event.clientX - rect.left) / rect.width,
        (event.clientY - rect.top) / rect.height
      ));
    }, { passive: false });

    box.addEventListener('dblclick', () => {
      if (this.#crop.run().is_active) this.#actions.applyCrop.run();
      else this.#actions.fit.run();
    });
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
      /* по коду клавиши: буква та же при любой раскладке; Ctrl+C не трогаем */
      if (event.code === 'KeyC' && !event.ctrlKey && !event.metaKey && !event.altKey) this.#toggleCrop();
      if (this.#crop.run().is_active) this.#cropKey(event);
      else if (KEY_ARROWS[event.key]) this.#nudge(event);
    });
  }

  /* Enter и Esc при обрезке — те же кнопки «Применить» и «Отмена». Нажатие
     гасим: иначе браузер ещё и «нажмёт» кнопку в фокусе — например,
     «Выделить область», и рамка откроется снова. */
  #cropKey(event) {
    const button = { Enter: this.#nodes.crop_apply, Escape: this.#nodes.crop_cancel }[event.key];
    if (!button) return;
    event.preventDefault();
    button.click();
  }

  /* Стрелки двигают картинку как перетаскивание: шаг — доля стороны холста,
     с Shift — крупный. */
  #nudge(event) {
    const frame = this.#geometry.run();
    if (!frame.has_image) return;
    event.preventDefault();
    const step = event.shiftKey ? FrameDictionary.KEY_MOVE_STEP_LARGE : FrameDictionary.KEY_MOVE_STEP;
    const [x, y] = KEY_ARROWS[event.key];
    this.#actions.move.run(new MoveImageDTO(frame.offset_x, frame.offset_y, x * step, y * step));
  }

  #mountPanel() {
    this.#nodes.zoom.oninput = () => {
      const steps = parseFloat(this.#nodes.zoom.value) / FrameDictionary.ZOOM_SLIDER_STEPS_PER_DOUBLING;
      this.#actions.zoom.run(new ZoomImageDTO(Math.pow(2, steps)));
    };
    /* процент вписывают руками: «150», «150%», «37,5» */
    this.#nodes.zoom_value.onchange = () => {
      const percent = parseFloat(this.#nodes.zoom_value.value.replace(',', '.'));
      if (isFinite(percent) && percent > 0) this.#actions.zoom.run(new ZoomImageDTO(percent / 100));
      else this.#actions.zoom.run(new ZoomImageDTO(this.#geometry.run().zoom));
    };
    this.#nodes.actual.onclick = () => this.#actions.zoom.run(new ZoomImageDTO(1));
    this.#nodes.fill.onclick = () => this.#actions.fill.run();
    this.#nodes.fit.onclick = () => this.#actions.fit.run();
    this.#nodes.center.onclick = () => this.#actions.center.run();
    this.#nodes.trim_visible.onclick = () => this.#actions.trimVisible.run();
    this.#nodes.trim_fit.onclick = () => this.#actions.trimFit.run();
    this.#nodes.trim_match.onclick = () => this.#actions.trimMatch.run();
    this.#nodes.grid_button.onclick = () => this.#actions.toggleGrid.run();
    this.#nodes.crop_button.onclick = () => this.#toggleCrop();
    this.#nodes.crop_apply.onclick = () => this.#actions.applyCrop.run();
    this.#nodes.crop_cancel.onclick = () => this.#actions.cancelCrop.run();
  }

  /* кнопка и клавиша C — переключатель: открыть рамку или убрать её */
  #toggleCrop() {
    if (this.#crop.run().is_active) this.#actions.cancelCrop.run();
    else this.#actions.startCrop.run();
  }

  /**
   * За что взялись: ручка или рамка — тянем её; мимо рамки — рисуем новую из точки.
   * @param {PointerEvent} event @param {DOMRect} rect @param {CropAreaDTO} area
   */
  #cropGrip(event, rect, area) {
    const grip = event.target.closest('[data-handle]');
    if (grip) {
      return { handle: grip.dataset.handle, from_x: area.x, from_y: area.y,
               from_width: area.width, from_height: area.height };
    }
    return {
      handle: CropHandleEnum.SE,
      from_x: (event.clientX - rect.left) / rect.width,
      from_y: (event.clientY - rect.top) / rect.height,
      from_width: 0, from_height: 0
    };
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
