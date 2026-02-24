import type { PatternFn } from './utils'
import { SEED, cos, gamma, clamp01, noise2d, sin, sqrt } from './utils'

export const rings: PatternFn = (x, y, w, h, t) => {
  const cx = (x - w * 0.5) / (w * 0.5), cy = (y - h * 0.5) / (h * 0.5)
  const r = sqrt(cx * cx + cy * cy)
  const wobble = noise2d(cx * 2, cy * 2, SEED ^ 88) * 0.3
  const rr = cos(r * 30 + wobble - y / 25 + t) * 0.5 + 0.5
  const diag = sin((x - 2 * y) / 23 + t * 0.5 + wobble) * 0.5 + 0.5
  return gamma(clamp01(0.65 * rr + 0.35 * diag), 1.1)
}
