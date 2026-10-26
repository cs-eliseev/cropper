/* Рамка обрезки поверх кадра: затемнение вокруг, ручки, размер результата
   и кнопки «Применить» / «Отмена» под кадром. */

class CropAreaView {
  #crop;
  #nodes;

  /** @param {GetCropAreaAction} crop @param {object} nodes */
  constructor(crop, nodes) {
    this.#crop = crop;
    this.#nodes = nodes;
  }

  render() {
    const area = this.#crop.run();
    this.#nodes.crop.hidden = !area.is_active;
    this.#nodes.crop_apply.hidden = !area.is_active;
    this.#nodes.crop_cancel.hidden = !area.is_active;
    this.#nodes.crop_button.classList.toggle('btn--on', area.is_active);
    this.#nodes.box.classList.toggle('canvas--crop', area.is_active);
    if (!area.is_active) return;

    const style = this.#nodes.crop_area.style;
    style.left = (area.x * 100) + '%';
    style.top = (area.y * 100) + '%';
    style.width = (area.width * 100) + '%';
    style.height = (area.height * 100) + '%';
    this.#nodes.crop_size.textContent = area.pixel_width + '×' + area.pixel_height;
  }
}
