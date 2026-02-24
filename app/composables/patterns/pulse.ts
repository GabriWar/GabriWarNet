import type { PatternFn } from './utils'
import { SEED, TAU, clamp01, gamma, noise2d, sin, sqrt } from './utils'

export const pulse: PatternFn = (x, y, w, h, t) => {
  const hw = w * 0.5, hh = h * 0.5
  const dx = x - hw, dy = y - hh
  const r = sqrt(dx * dx + dy * dy)
  const maxR = sqrt(hw * hw + hh * hh)
  const jitter = noise2d(x * 0.02, y * 0.02, SEED ^ 55) * 0.3
  const wave = sin(r * 0.12 - t * 2.5 + jitter * TAU) * 0.5 + 0.5
  const fade = 1 - r / maxR
  return gamma(clamp01(wave * fade), 1.2)
}
