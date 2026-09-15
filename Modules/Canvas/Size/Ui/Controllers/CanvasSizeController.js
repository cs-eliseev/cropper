/* Точка входа: события полей и кнопок → DTO → одно действие. */

class CanvasSizeController {
  #resize;
  #applyPreset;
  #swap;
  #view;
  #nodes;

  constructor(deps) {
    this.#resize = deps.resize;
    this.#applyPreset = deps.applyPreset;
    this.#swap = deps.swap;
    this.#view = deps.view;
    this.#nodes = deps.nodes;
  }

  mount() {
    this.#view.buildPresets(preset => this.#applyPreset.run(new ApplyCanvasPresetDTO(preset.id)));

    const commit = () => this.#resize.run(new ResizeCanvasDTO(
      parseInt(this.#nodes.width.value, 10),
      parseInt(this.#nodes.height.value, 10)
    ));

    [this.#nodes.width, this.#nodes.height].forEach(input => {
      input.oninput = () => { input.value = input.value.replace(/[^0-9]/g, ''); };
      input.onblur = commit;
      input.onkeydown = event => { if (event.key === 'Enter') input.blur(); };
    });

    this.#nodes.swap.onclick = () => this.#swap.run();
  }
}
