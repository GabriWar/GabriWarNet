<template>
  <canvas ref="canvasRef" :style="{ imageRendering: 'pixelated' }" />
</template>

<script setup lang="ts">
import { patterns, renderPattern, randomizeSeed } from '~/composables/patterns'

const props = withDefaults(defineProps<{
  name: string
  width?: number
  height?: number
  dither?: boolean
  invert?: boolean
  speed?: number
}>(), {
  width: 576,
  height: 400,
  dither: true,
  invert: false,
  speed: 1,
})

const canvasRef = ref<HTMLCanvasElement | null>(null)

let time = Math.random() * 500 + 50
let lastFrame = 0
let rafId = 0

function frame(now: number) {
  const dt = lastFrame ? (now - lastFrame) / 1000 : 0.016
  lastFrame = now
  time += dt * props.speed

  const canvas = canvasRef.value
  if (!canvas) { rafId = requestAnimationFrame(frame); return }

  const fn = patterns[props.name]
  if (!fn) { rafId = requestAnimationFrame(frame); return }

  const ctx = canvas.getContext('2d')
  if (ctx) {
    renderPattern(ctx, fn, props.width, props.height, time, props.dither, props.invert)
  }

  rafId = requestAnimationFrame(frame)
}

onMounted(() => {
  if (canvasRef.value) {
    canvasRef.value.width = props.width
    canvasRef.value.height = props.height
  }
  randomizeSeed()
  rafId = requestAnimationFrame(frame)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
})

watch(() => [props.width, props.height], () => {
  if (canvasRef.value) {
    canvasRef.value.width = props.width
    canvasRef.value.height = props.height
  }
})
</script>
