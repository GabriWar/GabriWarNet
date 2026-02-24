import type { PatternFn } from './utils'
import { SEED, abs, fbm, gamma, noise2d } from './utils'

export const terrain: PatternFn = (x, y, _w, _h, t) => {
  const s = 0.008
  const drift = t * 0.05
  const n = fbm(x * s + drift, y * s, 4, SEED ^ 777)
  const height = n + noise2d(x * 0.02 + drift, y * 0.02, SEED ^ 888) * 0.15
  const contour = height * 12
  const line = abs((contour % 1 + 1) % 1 - 0.5) * 2
  return gamma(1 - line, 2.5)
}
