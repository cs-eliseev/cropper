/* Загрузить картинку в кадр. Файл либо уже принесли перетаскиванием,
   либо его нужно выбрать в диалоге — операция одна и та же. */

class LoadImageAction {
  #files;
  #decoder;
  #frame;
  #events;

  /**
   * @param {FileReaderInterface} files @param {ImageDecoderInterface} decoder
   * @param {FrameRepositoryInterface} frame @param {EventBus} events
   */
  constructor(files, decoder, frame, events) {
    this.#files = files;
    this.#decoder = decoder;
    this.#frame = frame;
    this.#events = events;
  }

  /** @param {LoadImageDTO} dto @returns {Promise<FrameGeometryDTO|null>} null — файл не выбран */
  async run(dto) {
    const file = dto.file || await this.#files.pick('image/*');
    if (!file) return null;
    const image = await this.#decoder.decode(file);
    this.#frame.updateImage(image);
    this.#events.publish(new ImageLoadedEvent(
      image.getName(), image.getSize().getWidth(), image.getSize().getHeight()
    ));
    return new FrameGeometryDTO(
      true, image.getSize().getWidth(), image.getSize().getHeight(),
      this.#frame.getZoom().getValue(), 0.5, 0.5, image.getName()
    );
  }
}
