/* Внутренний порт: холст нужного размера, в который можно нарисовать
   и забрать результат файлом. За портом — канвас браузера. */

/** @interface */
class CanvasFactoryInterface {
  /** @param {SizeVO} size @returns {ExportTargetDTO} */
  create(size) { throw new Error('not implemented'); }
}

/** @type {symbol} */
const CanvasFactoryToken = Symbol('CanvasFactoryInterface');
