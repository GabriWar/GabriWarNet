import type { PatternFn } from './utils'
import { clamp01, cos, sin, sqrt } from './utils'

export const interference: PatternFn = (x, y, w, h, t) => {
  const ox = sin(t * 0.3) * w * 0.1, oy = cos(t * 0.25) * h * 0.1
  const d1x = x - w * 0.3 - ox, d1y = y - h * 0.3 - oy
  const d2x = x - w * 0.7 + ox, d2y = y - h * 0.7 + oy
  const d3x = x - w * 0.5, d3y = y - h * (0.5 + sin(t * 0.4) * 0.15)
  const v = sin(sqrt(d1x * d1x + d1y * d1y) * 0.15 - t)
    + sin(sqrt(d2x * d2x + d2y * d2y) * 0.15 + t * 0.7)
    + sin(sqrt(d3x * d3x + d3y * d3y) * 0.1 - t * 0.5)
  return clamp01((v + 3) / 6)
}
