/* Базовая ошибка геометрии: домен, а не инфраструктура. */

class GeometryException extends Error {
  constructor(message) {
    super(message);
    this.name = new.target.name;
  }

  /** @returns {object} структурированный контекст для лога */
  getDetails() { return {}; }
}
