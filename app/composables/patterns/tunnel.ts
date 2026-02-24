import type { PatternFn } from './utils'
import { abs, max } from './utils'

export const tunnel: PatternFn = (x, y, w, h, t) => {
  const hw = w * 0.5, hh = h * 0.5
  const dx = x - hw, dy = y - hh
  const distance = max(abs(dx), abs(dy))
  const maxD = max(hw, hh)
  const nd = distance / maxD
  const pf = 1 - 0.3 * (1 - nd)
  const period = 30 * pf
  if (period < 1) return 0.5
  const pos = ((distance + t * 20) % period + period) % period
  return pos < 15 * pf ? 1 : 0
}
