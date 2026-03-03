export const { sin, cos, sqrt, abs, floor, max, min, pow, atan2, tanh, imul } = Math
export const TAU = Math.PI * 2
export const PI = Math.PI

export type PatternFn = (x: number, y: number, w: number, h: number, t: number) => number

// ── per-session random seed ──────────────────────────────────────────
export let SEED = 0

export function randomizeSeed() {
  SEED = (Math.random() * 0x7FFFFFFF) >>> 0
}

// ── math primitives ──────────────────────────────────────────────────
export function clamp01(v: number) { return v < 0 ? 0 : v > 1 ? 1 : v }
export function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
export function gamma(v: number, g: number) { return pow(v < 0 ? 0 : v > 1 ? 1 : v, g) }

export function distFromCellCenter(coord: number, spacing: number) {
  const frac = ((coord / spacing) % 1 + 1) % 1
  return abs(frac - 0.5) * spacing
}

export function aaEdge(d: number, halfThick: number, softness: number) {
  const edge = abs(d) - halfThick
  if (edge < -softness) return 1
  if (edge > softness) return 0
  return 1 - (edge + softness) / (2 * softness)
}

// ── fast hash / noise ────────────────────────────────────────────────
function hash(x: number) {
  x = imul(x, 0x45d9f3b)
  x ^= x >>> 16
  x = imul(x, 0x45d9f3b)
  x ^= x >>> 16
  return x >>> 0
}

export function hash2f(x: number, y: number, seed: number) {
  return hash((seed + imul(x >>> 0, 374761393) + imul(y >>> 0, 668265263)) >>> 0) / 0xFFFFFFFF
}

export function noise2d(x: number, y: number, seed: number) {
  const xi = floor(x), yi = floor(y)
  const xf = x - xi, yf = y - yi
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  const n00 = hash2f(xi, yi, seed)
  const n10 = hash2f(xi + 1, yi, seed)
  const n01 = hash2f(xi, yi + 1, seed)
  const n11 = hash2f(xi + 1, yi + 1, seed)
  return (n00 * (1 - u) + n10 * u) * (1 - v) + (n01 * (1 - u) + n11 * u) * v
}

export function fbm(x: number, y: number, octaves: number, seed: number) {
  let value = 0, amp = 0.5, freq = 1, maxVal = 0
  for (let i = 0; i < octaves; i++) {
    value += amp * noise2d(x * freq, y * freq, (seed + i * 1000) >>> 0)
    maxVal += amp
    amp *= 0.5
    freq *= 2
  }
  return value / maxVal
}

// ── Bayer 8x8 dithering ─────────────────────────────────────────────
const BAYER = new Uint8Array([
  0, 32, 8, 40, 2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44, 4, 36, 14, 46, 6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
  3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47, 7, 39, 13, 45, 5, 37,
  63, 31, 55, 23, 61, 29, 53, 21,
])

// ── renderer ─────────────────────────────────────────────────────────
let cachedImgData: ImageData | null = null
let cachedW = 0
let cachedH = 0

export function renderPattern(
  ctx: CanvasRenderingContext2D,
  fn: PatternFn,
  w: number,
  h: number,
  t: number,
  dither: boolean,
  invert: boolean,
) {
  if (!cachedImgData || cachedW !== w || cachedH !== h) {
    cachedImgData = ctx.createImageData(w, h)
    cachedW = w
    cachedH = h
  }
  const data = cachedImgData.data

  if (dither) {
    for (let y = 0; y < h; y++) {
      const row = (y & 7) << 3
      for (let x = 0; x < w; x++) {
        const intensity = fn(x, y, w, h, t)
        const threshold = (BAYER[row + (x & 7)] + 0.5) * 0.015625
        const v = (intensity > threshold) !== invert ? 255 : 0
        const i = (y * w + x) << 2
        data[i] = v
        data[i | 1] = v
        data[i | 2] = v
        data[i | 3] = 255
      }
    }
  }
  else {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const raw = fn(x, y, w, h, t)
        const v = (invert ? 1 - raw : raw) * 255 | 0
        const i = (y * w + x) << 2
        data[i] = v
        data[i | 1] = v
        data[i | 2] = v
        data[i | 3] = 255
      }
    }
  }

  ctx.putImageData(cachedImgData, 0, 0)
}
