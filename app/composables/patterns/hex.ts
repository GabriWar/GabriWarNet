import type { PatternFn } from './utils'
import { SEED, TAU, clamp01, floor, gamma, hash2f, sin, sqrt } from './utils'

export const hex: PatternFn = (x, y, _w, _h, t) => {
  const size = 18 + sin(t * 0.3) * 4
  const s3 = 1.7320508
  const qy = y / (size * s3)
  const row = floor(qy)
  const cx = (floor(x / size - (row & 1) * 0.5) + (row & 1) * 0.5 + 0.5) * size
  const cy = (row + 0.5) * size * s3
  const dx = x - cx, dy = y - cy
  const d = sqrt(dx * dx + dy * dy)
  const cellHash = hash2f(floor(cx), floor(cy), SEED ^ 42) * TAU
  const ring = sin(d * 0.6 - t * 2 + cellHash) * 0.5 + 0.5
  return gamma(clamp01(ring), 1.3)
}
