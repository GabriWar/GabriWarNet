import type { PatternFn } from './utils'
import { PI, aaEdge, clamp01, cos, distFromCellCenter, sin } from './utils'

export const moire: PatternFn = (x, y, w, h, t) => {
  const xf = x - w * 0.5, yf = y - h * 0.5
  const wobble = sin(t * 0.15) * 0.5
  const a1 = wobble * PI / 180
  const a2 = (3 + sin(t * 0.3) * 4 + wobble) * PI / 180
  const r1 = xf * cos(a1) + yf * sin(a1)
  const r2 = xf * cos(a2) + yf * sin(a2)
  const g1 = aaEdge(distFromCellCenter(r1, 6 + sin(t * 0.1) * 0.3), 1, 1)
  const g2 = aaEdge(distFromCellCenter(r2, 6.5 + cos(t * 0.13) * 0.3), 1, 1)
  return clamp01((g1 + g2) * 0.5)
}
