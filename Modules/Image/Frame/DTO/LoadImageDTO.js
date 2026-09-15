/* Что загружать. file заполнен, когда картинку перетащили;
   null — значит нужно открыть диалог выбора. */

class LoadImageDTO {
  /** @param {PickedFileDTO|null} file */
  constructor(file) {
    this.file = file;
    Object.freeze(this);
  }
}
