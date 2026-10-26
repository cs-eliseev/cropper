/* Загрузили новую картинку — имя файла собирается заново от её имени.
   Чужое событие, своё действие: тонко и без своей логики. */

class OnImageLoadedResetFileNameListener {
  #reset;

  /** @param {ResetExportFileNameAction} reset */
  constructor(reset) {
    this.#reset = reset;
  }

  /** @param {ImageLoadedEvent} event */
  handle(event) { this.#reset.run(); }
}
