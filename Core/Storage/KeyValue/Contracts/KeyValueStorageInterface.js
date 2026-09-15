/* Порт к хранилищу «ключ — значение». Реализация может отсутствовать
   (приватный режим, запрет на хранение), поэтому запись возвращает признак успеха,
   а чтение — запасное значение. Исключений порт не бросает: для настроек
   пропавшее хранилище — не ошибка. */

/** @interface */
class KeyValueStorageInterface {
  /** @param {string} key @param {*} [fallback] @returns {*} */
  get(key, fallback) { throw new Error('not implemented'); }

  /** @param {string} key @param {*} value @returns {boolean} удалось ли сохранить */
  set(key, value) { throw new Error('not implemented'); }

  /** @param {string} key */
  remove(key) { throw new Error('not implemented'); }
}

/** @type {symbol} */
const KeyValueStorageToken = Symbol('KeyValueStorageInterface');
