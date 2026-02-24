import type { PatternFn } from './utils'
import { SEED, TAU, atan2, clamp01, cos, gamma, max, noise2d, sin, sqrt } from './utils'

export const vortex: PatternFn = (x, y, w, h, t) => {
  const dx = x - w * 0.5, dy = y - h * 0.5
  const r = sqrt(dx * dx + dy * dy)
  const a = atan2(dy, dx)
  const twist = r * 0.03 + t * 0.8
  const spiralA = a + twist
  const jitter = noise2d(r * 0.03 + cos(a), sin(a), SEED ^ 33) * 0.5
  const bands = sin(spiralA * 6 + jitter * TAU) * 0.5 + 0.5
  const fade = 1 - clamp01(r / (max(w, h) * 0.45))
  const center = clamp01(r / 20)
  return gamma(clamp01(bands * fade * center), 1.1)
}
