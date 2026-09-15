/* Холст изменил размер — предложить новое имя файла.
   Чужое событие, своё действие: тонко и без своей логики. */

class OnCanvasResizedRenameFileListener {
  #suggest;

  /** @param {SuggestExportFileNameAction} suggest */
  constructor(suggest) {
    this.#suggest = suggest;
  }

  /** @param {CanvasResizedEvent} event */
  handle(event) { this.#suggest.run(); }
}
