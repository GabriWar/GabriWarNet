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

function frame(now: number) {
  const dt = lastFrame ? (now - lastFrame) / 1000 : 0.016
  lastFrame = now
  time += dt * props.speed

  const canvas = canvasRef.value
  if (canvas) {
    const ctx = canvas.getContext('2d')
    if (ctx) renderPattern(ctx, patternFn, props.width, props.height, time, true, false)
  }

  rafId = requestAnimationFrame(frame)
}

onMounted(() => {
  randomizeSeed()
  time = Math.random() * 500 + 50
  const name = patternNames[Math.floor(Math.random() * patternNames.length)]
  patternFn = patterns[name]

  if (canvasRef.value) {
    canvasRef.value.width = props.width
    canvasRef.value.height = props.height
  }

  rafId = requestAnimationFrame(frame)
})

onUnmounted(() => {
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
