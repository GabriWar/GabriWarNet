import type { PatternFn } from './utils'
import { SEED, abs, clamp01, cos, min, noise2d, sin } from './utils'

export const lattice: PatternFn = (x, y, w, h, t) => {
  const cx = x - w * 0.5, cy = y - h * 0.5
  const a = t * 0.15
  const ca = cos(a), sa = sin(a)
  const rx = cx * ca - cy * sa, ry = cx * sa + cy * ca
  const spacing = 20 + sin(t * 0.2) * 4
  const jitter = noise2d(rx * 0.02, ry * 0.02, SEED ^ 77) * 4
  const gx = abs(((rx + jitter) % spacing + spacing) % spacing - spacing * 0.5)
  const gy = abs(((ry + jitter * 0.7) % spacing + spacing) % spacing - spacing * 0.5)
  const line = min(gx, gy)
  return clamp01(1 - line / 3)
}
