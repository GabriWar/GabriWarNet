import type { PatternFn } from './utils'
import { SEED, TAU, atan2, clamp01, floor, gamma, max, noise2d, sin, sqrt } from './utils'

export const spiral: PatternFn = (x, y, w, h, t) => {
  const dx = x - w * 0.5, dy = y - h * 0.5
  const r = sqrt(dx * dx + dy * dy)
  const a = atan2(dy, dx)
  const jitter = noise2d(x * 0.015, y * 0.015, SEED ^ 42) * 0.4
  const arms = 3 + floor(sin(t * 0.1) * 1.5 + 1.5)
  const sp = ((a * arms / TAU + r / 50 - t * 0.4 + jitter) % 1 + 1) % 1
  const fade = 1 - clamp01(r / (max(w, h) * 0.5))
  return gamma(clamp01((sin(sp * TAU) * 0.5 + 0.5) * (0.3 + fade * 0.7)), 1.3)
}
