/* Кадр подвинули или приблизили. */

class FrameChangedEvent {
  /** @param {number} zoom @param {number} offset_x @param {number} offset_y */
  constructor(zoom, offset_x, offset_y) {
    this.zoom = zoom;
    this.offset_x = offset_x;
    this.offset_y = offset_y;
    this.occurred_at = new Date().toISOString();
    Object.freeze(this);
  }
}
