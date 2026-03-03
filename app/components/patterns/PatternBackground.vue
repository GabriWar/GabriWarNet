<template>
  <div class="pattern-bg">
    <canvas ref="canvasRef" />
    <div class="pattern-bg-fade" />
  </div>
</template>

<script setup lang="ts">
import { patterns, patternNames, renderPattern, randomizeSeed } from '~/composables/patterns'

const props = withDefaults(defineProps<{
  width?: number
  height?: number
  speed?: number
  opacity?: number
}>(), {
  width: 288,
  height: 200,
  speed: 0.6,
  opacity: 0.15,
})

const canvasRef = ref<HTMLCanvasElement | null>(null)

let patternFn = patterns[patternNames[0]]
let time = 0
let lastFrame = 0
let rafId = 0
let worker: Worker | null = null
const TARGET_DT = 1000 / 30

// ── Main-thread fallback ────────────────────────────────
function frame(now: number) {
  rafId = requestAnimationFrame(frame)

  const elapsed = now - lastFrame
  if (elapsed < TARGET_DT) return

  // Yield to pending input events (better INP)
  if ((navigator as any).scheduling?.isInputPending?.()) return

  const dt = lastFrame ? elapsed / 1000 : 0.016
  lastFrame = now
  time += dt * props.speed

  const canvas = canvasRef.value
  if (canvas) {
    const ctx = canvas.getContext('2d')
    if (ctx) renderPattern(ctx, patternFn, props.width, props.height, time, true, false, 2)
  }
}

onMounted(() => {
  randomizeSeed()
  time = Math.random() * 500 + 50
  const name = patternNames[Math.floor(Math.random() * patternNames.length)]

  const canvas = canvasRef.value
  if (!canvas) return

  canvas.width = props.width
  canvas.height = props.height

  // Try OffscreenCanvas + Worker (moves all computation off main thread)
  if (typeof OffscreenCanvas !== 'undefined' && canvas.transferControlToOffscreen) {
    try {
      const offscreen = canvas.transferControlToOffscreen()
      worker = new Worker(
        new URL('../../composables/patterns/patternWorker.ts', import.meta.url),
        { type: 'module' }
      )
      worker.postMessage({
        type: 'init',
        canvas: offscreen,
        width: props.width,
        height: props.height,
        speed: props.speed,
        time,
        patternName: name,
      }, [offscreen])
      return
    }
    catch {
      // OffscreenCanvas or Worker failed — fall back to main thread
      worker = null
    }
  }

  // Fallback: main-thread rendering
  patternFn = patterns[name]
  rafId = requestAnimationFrame(frame)
})

onUnmounted(() => {
  if (worker) {
    worker.postMessage({ type: 'stop' })
    worker.terminate()
    worker = null
  }
  cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.pattern-bg {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.pattern-bg canvas {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: pixelated;
  opacity: v-bind('props.opacity');
}

.pattern-bg-fade {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 50%, transparent 40%, var(--color-background) 100%);
}
</style>
