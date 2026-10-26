/* Константы модуля кадра. */

class FrameDictionary {
  /* ползунок приближения логарифмический: столько делений — удвоение масштаба,
     иначе мелкие масштабы ужались бы в первые миллиметры дорожки */
  static ZOOM_SLIDER_STEPS_PER_DOUBLING = 100;
  /* шаг стрелок — доля стороны холста; с Shift — крупный */
  static KEY_MOVE_STEP = 0.01;
  static KEY_MOVE_STEP_LARGE = 0.1;
}
