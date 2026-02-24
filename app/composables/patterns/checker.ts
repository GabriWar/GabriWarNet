import type { PatternFn } from './utils'
import { SEED, cos, floor, noise2d, sin } from './utils'

export const checker: PatternFn = (x, y, w, h, t) => {
  const s = 18 + sin(t * 0.5) * 6
  const cx = x - w * 0.5, cy = y - h * 0.5
  const a = t * 0.2
  const ca = cos(a), sa = sin(a)
  const rx = cx * ca - cy * sa
  const ry = cx * sa + cy * ca
  const warp = noise2d(rx * 0.01, ry * 0.01, SEED ^ 55) * 8
  const check = (floor((rx + warp) / s) + floor((ry + warp) / s)) & 1
  return check ? 1 : 0
}
