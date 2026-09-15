/* Жест перетаскивания: откуда начали и на сколько сдвинули.
   Сдвиг — доля стороны холста, а не пиксели экрана, чтобы не зависеть от того,
   насколько уменьшено превью. Исходное положение передаётся явно: тогда
   возврат курсора возвращает картинку туда же, откуда её потянули. */

class MoveImageDTO {
  /** @param {number} from_x @param {number} from_y @param {number} dx_ratio @param {number} dy_ratio */
  constructor(from_x, from_y, dx_ratio, dy_ratio) {
    this.from_x = from_x;
    this.from_y = from_y;
    this.dx_ratio = dx_ratio;
    this.dy_ratio = dy_ratio;
    Object.freeze(this);
  }
}
