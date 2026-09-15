/* Публичная поверхность модуля: значения токенов темы для того, что рисуется
   на канвасе, — CSS туда не достаёт. */

/** @interface */
class ThemeTokensInterface {
  /** @returns {ThemeTokensDTO} */
  read() { throw new Error('not implemented'); }

  /** Сбросить кэш: тема сменилась. */
  invalidate() { throw new Error('not implemented'); }
}

/** @type {symbol} */
const ThemeTokensToken = Symbol('ThemeTokensInterface');
