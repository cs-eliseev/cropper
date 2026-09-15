/* Новое приближение и точка, которая должна остаться на месте
   (доля стороны холста; 0.5/0.5 — центр). */

class ZoomImageDTO {
  /** @param {number} zoom @param {number} anchor_x @param {number} anchor_y */
  constructor(zoom, anchor_x = 0.5, anchor_y = 0.5) {
    this.zoom = zoom;
    this.anchor_x = anchor_x;
    this.anchor_y = anchor_y;
    Object.freeze(this);
  }
}
