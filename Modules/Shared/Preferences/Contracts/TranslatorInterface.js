/* Публичная поверхность модуля: перевод строки по ключу.
   Любой модуль зависит от этого интерфейса, а не от словарей. */

/** @interface */
class TranslatorInterface {
  /** @param {string} key @param {object} [vars] подстановки вида {n: 3} @returns {string} */
  translate(key, vars) { throw new Error('not implemented'); }
}

/** @type {symbol} */
const TranslatorToken = Symbol('TranslatorInterface');
