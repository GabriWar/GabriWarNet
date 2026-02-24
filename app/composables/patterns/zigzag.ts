import type { PatternFn } from './utils'
import { SEED, abs, clamp01, cos, noise2d, sin } from './utils'

export const zigzag: PatternFn = (x, y, _w, _h, t) => {
  const period = 36 + sin(t * 0.4) * 8
  const amp = 18 + cos(t * 0.3) * 6
  const yShift = y + t * 35 + noise2d(x * 0.02, t * 0.1, SEED ^ 88) * 10
  const yMod = ((yShift % period) + period) % period
  const saw = abs(yMod - period * 0.5) / (period * 0.5)
  const offset = saw * amp
  const xMod = (((x + offset) % period) + period) % period
  const line = abs(xMod - period * 0.5) / (period * 0.5)
  return clamp01(1.3 - line * 2.5)
}
