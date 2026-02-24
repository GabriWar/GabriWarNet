import type { PatternFn } from './utils'
import { SEED, clamp01, cos, gamma, noise2d, sin } from './utils'

export const caustics: PatternFn = (x, y, _w, _h, t) => {
  const s = 0.05
  const jx = noise2d(x * 0.008, y * 0.008, SEED ^ 44) * 6
  const jy = noise2d(x * 0.008, y * 0.008, SEED ^ 144) * 6
  const px = x + jx, py = y + jy
  const v1 = sin(px * s + sin(py * s * 0.5 + t) * 2)
  const v2 = sin(py * s + sin(px * s * 0.7 - t * 0.8) * 2)
  const v3 = sin((px + py) * s * 0.5 + cos(t * 0.5) * 2)
  return gamma(clamp01((v1 + v2 + v3 + 3) / 6), 1.8)
}
