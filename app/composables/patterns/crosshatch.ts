import type { PatternFn } from './utils'
import { SEED, clamp01, noise2d, sin } from './utils'

export const crosshatch: PatternFn = (x, y, _w, _h, t) => {
  const drift = noise2d(x * 0.005 + t * 0.1, y * 0.005, SEED ^ 77) * 4
  const s1 = sin((x * 0.7 + y * 0.7) * 0.15 + t + drift)
  const s2 = sin((x * 0.7 - y * 0.7) * 0.15 - t * 0.6 + drift * 0.5)
  const s3 = sin(x * 0.1 + t * 0.3 + drift * 0.3)
  return clamp01((s1 + s2 + s3 + 3) / 6)
}
