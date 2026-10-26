/* Как ведёт себя рамка обрезки под рукой — как в редакторе: угол тянет две
   стороны, ручка на стороне — одну, рамка целиком двигается. Рамка никогда
   не выходит за картинку: лишнее поле в результат не попадёт.
   Чистая: всё в единицах холста, ничего не хранит. */

class CropAreaService {
  /**
   * @param {DrawRectDTO} from рамка в начале жеста
   * @param {string} handle значение CropHandleEnum
   * @param {number} dx @param {number} dy сдвиг в единицах холста
   * @param {DrawRectDTO} bounds где рамке можно быть — видимая часть картинки
   * @param {boolean} keep_ratio держать пропорции рамки (только для углов)
   * @returns {DrawRectDTO}
   */
  dragged(from, handle, dx, dy, bounds, keep_ratio) {
    if (!Object.values(CropHandleEnum).includes(handle)) throw new InvalidCropHandleException(handle);
    if (handle === CropHandleEnum.MOVE) return this.#moved(from, dx, dy, bounds);

    const x = this.#axis(from.x, from.width, handle.includes('w'), handle.includes('e'), dx, bounds.x, bounds.width);
    const y = this.#axis(from.y, from.height, handle.includes('n'), handle.includes('s'), dy, bounds.y, bounds.height);
    let width = x.size;
    let height = y.size;

    if (keep_ratio && handle.length === 2) {
      /* у пустой рамки пропорций нет — тогда квадрат */
      const ratio = from.width > 0 && from.height > 0 ? from.width / from.height : 1;
      if (width / ratio > height) height = width / ratio;
      else width = height * ratio;
      if (width > x.limit) { width = x.limit; height = width / ratio; }
      if (height > y.limit) { height = y.limit; width = height * ratio; }
    }

    return new DrawRectDTO(
      x.sign > 0 ? x.anchor : x.anchor - width,
      y.sign > 0 ? y.anchor : y.anchor - height,
      width,
      height
    );
  }

  /** сдвиг целиком: размер прежний, рамка упирается в край картинки */
  #moved(from, dx, dy, bounds) {
    const fit = (value, low, high) => Math.min(Math.max(value, low), Math.max(low, high));
    return new DrawRectDTO(
      fit(from.x + dx, bounds.x, bounds.x + bounds.width - from.width),
      fit(from.y + dy, bounds.y, bounds.y + bounds.height - from.height),
      from.width,
      from.height
    );
  }

  /**
   * Одна ось. Противоположный край — якорь, он стоит на месте; тянущий край
   * может перескочить через якорь — тогда рамка разворачивается.
   * @returns {{anchor: number, sign: number, size: number, limit: number}}
   */
  #axis(start, size, moves_start, moves_end, delta, low, span) {
    const high = low + span;
    if (!moves_start && !moves_end) return { anchor: start, sign: 1, size, limit: size };
    const anchor = Math.min(Math.max(moves_start ? start + size : start, low), high);
    const edge = (moves_start ? start : start + size) + delta;
    const sign = edge >= anchor ? 1 : -1;
    const limit = sign > 0 ? high - anchor : anchor - low;
    return { anchor, sign, size: Math.min(Math.abs(edge - anchor), limit), limit };
  }
}
