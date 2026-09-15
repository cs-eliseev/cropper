/* Сохранить кадр файлом. Картинку рисует её владелец — модуль «Кадр»;
   здесь только размер, формат и отдача файла пользователю. */

class ExportImageAction {
  #settings;
  #canvas;
  #targets;
  #render;
  #writer;
  #events;
  #matte;

  /**
   * @param {ExportSettingsRepositoryInterface} settings @param {GetCanvasSizeInterface} canvas
   * @param {CanvasFactoryInterface} targets @param {RenderFrameInterface} render
   * @param {FileWriterInterface} writer @param {EventBus} events
   * @param {string} matte чем заливать поля там, где нет прозрачности
   */
  constructor(settings, canvas, targets, render, writer, events, matte) {
    this.#settings = settings;
    this.#canvas = canvas;
    this.#targets = targets;
    this.#render = render;
    this.#writer = writer;
    this.#events = events;
    this.#matte = matte;
  }

  /** @returns {Promise<ImageExportedEvent|null>} null — браузер не отдал файл */
  async run() {
    const size = this.#canvas.run().toSize();
    const format = this.#settings.getFormat();
    const settings = this.#settings.getSettings();

    const target = this.#targets.create(size);

    this.#render.run(new RenderFrameDTO(
      target.context, size.getWidth(), size.getHeight(),
      format.supports_alpha ? null : this.#matte
    ));

    const blob = await target.encode(format.mime, settings.quality);
    if (!blob) return null;

    this.#writer.save(settings.file_name, blob);
    const event = new ImageExportedEvent(settings.file_name, size.getWidth(), size.getHeight(), blob.size);
    this.#events.publish(event);
    return event;
  }
}
