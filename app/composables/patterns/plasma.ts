import type { PatternFn } from './utils'
import { SEED, cos, gamma, clamp01, noise2d, sin, sqrt } from './utils'

export const plasma: PatternFn = (x, y, w, h, t) => {
  const cx = w * (0.35 + sin(t * 0.2) * 0.15), cy = h * (0.2 + cos(t * 0.17) * 0.15)
  const dx = x - cx, dy = y - cy
  const d = sqrt(dx * dx + dy * dy)
  const jitter = noise2d(x * 0.02, y * 0.02, SEED ^ 55) * 0.5
  const p = sin(x / 11 + t + jitter)
    + sin((x + y) / 19 + t * 0.7)
    + cos(y / 13 + t * 0.5 + jitter)
    + sin(d / 9 + t * 1.3)
  return gamma(clamp01((p + 4) / 8), 1.2)
}
