import type { PatternFn } from './utils'
import { SEED, clamp01, floor, hash2f, sin, sqrt } from './utils'

export const starfield: PatternFn = (x, y, _w, _h, t) => {
  const cell = 7
  const cx = floor(x / cell), cy = floor(y / cell)
  const hv = hash2f(cx, cy, SEED ^ 12345)
  if (hv > 0.95) {
    const brightness = sin(t * (2 + hv * 4) + hv * 100) * 0.35 + 0.65
    const fx = x - (cx + 0.5) * cell, fy = y - (cy + 0.5) * cell
    const d = sqrt(fx * fx + fy * fy)
    const size = (hv - 0.95) * 20 * cell * 0.5
    return clamp01(brightness * (1 - d / size))
  }
  return 0
}
