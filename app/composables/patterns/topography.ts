import type { PatternFn } from './utils'
import { SEED, abs, floor, gamma, noise2d, sin } from './utils'

export const topography: PatternFn = (x, y, _w, _h, t) => {
  const drift = noise2d(x * 0.003, y * 0.003, SEED ^ 42) * 4
  const s = sin(x / 17 + t * 0.3 + drift)
    + sin(y / 29 + t * 0.2 + drift * 0.7)
    + sin((x + y) / 41 + t * 0.15)
    + noise2d(x * 0.01, y * 0.01, SEED ^ 123) * 0.5
  const wrapped = s - floor(s)
  return gamma(1 - abs(wrapped - 0.5) * 2, 2.2)
}
