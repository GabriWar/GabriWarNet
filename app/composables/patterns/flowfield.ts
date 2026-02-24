import type { PatternFn } from './utils'
import { PI, SEED, clamp01, cos, fbm, gamma, min, noise2d, sin, tanh } from './utils'

export const flowfield: PatternFn = (x, y, w, h, t) => {
  const s = 0.008
  const nx = x * s, ny = y * s
  const angle = fbm(nx + t * 0.08, ny, 4, SEED ^ 42) * (Math.PI * 2)
  const ca = cos(angle), sa = sin(angle)
  const turbX = fbm(nx * 2 + 100 + t * 0.05, ny * 2, 3, SEED ^ 542)
  const turbY = fbm(nx * 2 + t * 0.05, ny * 2 + 100, 3, SEED ^ 1042)
  const flowX = x + ca * 25 + turbX * 15
  const flowY = y + sa * 25 + turbY * 15
  const la = angle + PI * 0.5
  const lineCoord = flowX * cos(la) + flowY * sin(la)
  const lineValue = tanh(sin(lineCoord * 0.15) * 3) * 0.5 + 0.5
  const variation = noise2d(nx * 3 + 200, ny * 3 + 200, SEED ^ 2042)
  const edgeX = min(x / w, 1 - x / w) * 10
  const edgeY = min(y / h, 1 - y / h) * 10
  return gamma(clamp01(lineValue * (0.7 + variation * 0.3) * min(min(edgeX, edgeY), 1)), 1.2)
}
