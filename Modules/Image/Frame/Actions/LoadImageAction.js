/* Загрузить картинку в кадр. Файл либо уже принесли перетаскиванием,
   либо его нужно выбрать в диалоге — операция одна и та же.
   Картинка встаёт в 100%, а холст — ровно по ней: дальше её кадрируют.
   Размер холста — чужое хозяйство, поэтому идём через контракт модуля. */

class LoadImageAction {
  #files;
  #decoder;
  #frame;
  #resize;
  #events;

  /**
   * @param {FileReaderInterface} files @param {ImageDecoderInterface} decoder
   * @param {FrameRepositoryInterface} frame @param {ResizeCanvasInterface} resize @param {EventBus} events
   */
  constructor(files, decoder, frame, resize, events) {
    this.#files = files;
    this.#decoder = decoder;
    this.#frame = frame;
    this.#resize = resize;
    this.#events = events;
  }

  /** @param {LoadImageDTO} dto @returns {Promise<FrameGeometryDTO|null>} null — файл не выбран */
  async run(dto) {
    const file = dto.file || await this.#files.pick('image/*');
    if (!file) return null;
    const image = await this.#decoder.decode(file);
    /* кадр готов раньше холста: перерисовка по смене холста уже увидит картинку */
    this.#frame.updateImage(image, ZoomVO.actual());
    this.#resize.run(new ResizeCanvasDTO(image.getSize().getWidth(), image.getSize().getHeight()));
    this.#events.publish(new ImageLoadedEvent(
      image.getName(), image.getSize().getWidth(), image.getSize().getHeight()
    ));
    return new FrameGeometryDTO(
      true, image.getSize().getWidth(), image.getSize().getHeight(),
      this.#frame.getZoom().getValue(), 0.5, 0.5, image.getName()
    );
  }
}
