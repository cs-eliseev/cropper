/* Жест над рамкой обрезки: за что тянут, какой рамка была в начале жеста
   и на сколько сдвинули. Всё — доли сторон холста, как у MoveImageDTO:
   от уменьшения превью не зависит. Новая рамка рисуется из точки:
   from_width и from_height равны нулю, ручка — SE. */

class ChangeCropDTO {
  /**
   * @param {string} handle значение CropHandleEnum
   * @param {number} from_x @param {number} from_y @param {number} from_width @param {number} from_height
   * @param {number} dx_ratio @param {number} dy_ratio
   * @param {boolean} keep_ratio держать пропорции рамки (Shift)
   */
  constructor(handle, from_x, from_y, from_width, from_height, dx_ratio, dy_ratio, keep_ratio) {
    this.handle = handle;
    this.from_x = from_x;
    this.from_y = from_y;
    this.from_width = from_width;
    this.from_height = from_height;
    this.dx_ratio = dx_ratio;
    this.dy_ratio = dy_ratio;
    this.keep_ratio = keep_ratio;
    Object.freeze(this);
  }
}
