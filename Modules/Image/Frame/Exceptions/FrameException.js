/* Базовая ошибка модуля кадра. */

class FrameException extends Error {
  constructor(message) {
    super(message);
    this.name = new.target.name;
  }

  getDetails() { return {}; }
}
