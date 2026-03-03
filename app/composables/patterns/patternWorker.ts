import { patterns, renderPattern } from './index'
import { randomizeSeed } from './utils'
import type { PatternFn } from './utils'

let ctx: OffscreenCanvasRenderingContext2D | null = null
let patternFn: PatternFn
let time = 0
let speed = 0.6
let w = 288
let h = 200
let intervalId: ReturnType<typeof setInterval> | null = null

self.onmessage = (e: MessageEvent) => {
  const msg = e.data

  if (msg.type === 'init') {
    const canvas: OffscreenCanvas = msg.canvas
    ctx = canvas.getContext('2d')
    w = msg.width
    h = msg.height
    speed = msg.speed
    time = msg.time
    patternFn = patterns[msg.patternName]
    randomizeSeed()

    intervalId = setInterval(() => {
      if (!ctx) return
      time += (1 / 30) * speed
      renderPattern(ctx as unknown as CanvasRenderingContext2D, patternFn, w, h, time, true, false, 2)
    }, 1000 / 30)
  }

  if (msg.type === 'stop') {
    if (intervalId) clearInterval(intervalId)
    ctx = null
  }
}
