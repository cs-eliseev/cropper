/* Публичная поверхность: нарисовать кадр в переданный контекст.
   Так картинка остаётся внутри своего модуля — наружу уходят только пиксели,
   а не сам файл. Этим пользуется экспорт. */

/** @interface */
class RenderFrameInterface {
  /** @param {RenderFrameDTO} dto */
  run(dto) { throw new Error('not implemented'); }
}

/** @type {symbol} */
const RenderFrameToken = Symbol('RenderFrameInterface');
