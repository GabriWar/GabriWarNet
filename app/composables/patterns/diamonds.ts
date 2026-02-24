import type { PatternFn } from './utils'
import { SEED, abs, clamp01, gamma, noise2d, sin } from './utils'

export const diamonds: PatternFn = (x, y, _w, _h, t) => {
  const scale = 28 + sin(t * 0.3) * 6
  const ox = t * 18, oy = t * 12
  const jitter = noise2d((x + ox) * 0.015, (y + oy) * 0.015, SEED ^ 99) * 6
  const dx = abs((((x + ox + jitter) % scale) + scale) % scale - scale * 0.5)
  const dy = abs((((y + oy + jitter * 0.7) % scale) + scale) % scale - scale * 0.5)
  const d = (dx + dy) / scale
  return gamma(clamp01(1 - d * 2.2), 1.5)
}
