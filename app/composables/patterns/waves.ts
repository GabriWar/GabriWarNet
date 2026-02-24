import type { PatternFn } from './utils'
import { SEED, cos, gamma, clamp01, noise2d, sin, sqrt } from './utils'

export const waves: PatternFn = (x, y, w, h, t) => {
  const nx = x / w * 2 - 1, ny = y / h * 2 - 1
  const r = sqrt(nx * nx + ny * ny)
  const drift = noise2d(x * 0.005, y * 0.005, SEED ^ 99) * 3
  const horiz = sin(x / 19 + 0.7 * sin(y / 37 + drift) + t)
  const vert = cos(y / 23 + 0.9 * cos(x / 41 + drift) + t * 0.7)
  const radial = cos(r * 24 - y / 29 + t * 0.5 + drift * 0.5)
  return gamma(clamp01(0.45 * (horiz * 0.5 + 0.5) + 0.35 * (vert * 0.5 + 0.5) + 0.20 * (radial * 0.5 + 0.5)), 1.25)
}
