import type { PatternFn } from './utils'
import { SEED, clamp01, floor, noise2d, sin } from './utils'

export const fabric: PatternFn = (x, y, _w, _h, t) => {
  const jitter = noise2d(x * 0.015, y * 0.015, SEED ^ 66) * 2
  const warp = sin(y * 0.1 + t + jitter) * 3
  const weft = sin(x * 0.1 - t * 0.7 + jitter * 1.3) * 3
  const h1 = sin((x + warp) * 0.3 + jitter) * 0.5 + 0.5
  const h2 = sin((y + weft) * 0.3 + jitter * 0.7) * 0.5 + 0.5
  const weave = ((floor(x / 6) + floor(y / 6)) & 1) ? h1 : h2
  return clamp01(weave)
}
