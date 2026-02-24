import type { PatternFn } from './utils'
import { SEED, cos, gamma, clamp01, noise2d, sin, sqrt } from './utils'

export const ripple: PatternFn = (x, y, w, h, t) => {
  const hw = w * 0.5, hh = h * 0.5
  const dx = x - hw, dy = y - hh
  const r = sqrt(dx * dx + dy * dy)
  const jitter = noise2d(x * 0.02, y * 0.02, SEED ^ 77) * 8
  const rr = cos(r / 6.5 + jitter * 0.1 - y / 85 + t) * 0.5 + 0.5
  const wb = sin(x / 37 + 0.7 * cos(y / 53 + noise2d(y * 0.01, t, SEED ^ 33) * 2) + t * 0.4) * 0.5 + 0.5
  return gamma(clamp01(rr * 0.75 + wb * 0.25), 1.35)
}
