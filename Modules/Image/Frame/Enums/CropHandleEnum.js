/* За что тянут рамку обрезки: стороны света — ручки на углах и сторонах,
   MOVE — сама рамка целиком. */

const CropHandleEnum = Object.freeze({
  MOVE: 'move',
  N: 'n',
  S: 's',
  E: 'e',
  W: 'w',
  NE: 'ne',
  NW: 'nw',
  SE: 'se',
  SW: 'sw'
});
