/* Файл выбран, но браузер не смог его раскодировать. Ветка инфраструктуры:
   причина приходит из браузера и кладётся в cause. */

class ImageNotReadableException extends FrameException {
  /** @param {string} file_name @param {Error} [cause] */
  constructor(file_name, cause) {
    super('Image is not readable');
    this.file_name = file_name;
    this.cause = cause || null;
    Object.freeze(this);
  }

  getDetails() { return { file_name: this.file_name }; }
}
