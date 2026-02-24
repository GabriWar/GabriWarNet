import type { PatternFn } from './utils'
import { SEED, clamp01, fbm, min } from './utils'

export const warp: PatternFn = (x, y, w, h, t) => {
  const s = 0.012
  const nx = x * s, ny = y * s
  const wx = fbm(nx + t * 0.1, ny, 3, SEED ^ 100) * 3.5
  const wy = fbm(nx, ny + t * 0.1, 3, SEED ^ 200) * 3.5
  const val = fbm(nx + wx, ny + wy, 3, SEED ^ 300)
  const edgeX = min(x / w, 1 - x / w) * 8
  const edgeY = min(y / h, 1 - y / h) * 8
  return clamp01(val * min(min(edgeX, edgeY), 1))
}
