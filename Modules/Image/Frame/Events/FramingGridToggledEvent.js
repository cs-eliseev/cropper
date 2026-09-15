/* Сетка третей включена или выключена. */

class FramingGridToggledEvent {
  /** @param {boolean} is_visible */
  constructor(is_visible) {
    this.is_visible = is_visible;
    this.occurred_at = new Date().toISOString();
    Object.freeze(this);
  }
}
