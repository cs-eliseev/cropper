/* Холст, в который идёт экспорт: куда рисовать и как забрать результат.
   context — примитив браузера, аналог потока вывода. */

class ExportTargetDTO {
  /**
   * @param {CanvasRenderingContext2D} context
   * @param {(mime: string, quality: number) => Promise<Blob|null>} encode
   */
  constructor(context, encode) {
    this.context = context;
    this.encode = encode;
    Object.freeze(this);
  }
}
