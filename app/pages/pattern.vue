<template>
  <div class="pattern-page">
    <header class="pattern-header">
      <div class="pattern-title">
        <NuxtLink to="/" class="back-link">&larr;</NuxtLink>
        <h1>estrella</h1>
        <span class="subtitle">animated pattern gallery</span>
      </div>
      <div class="controls">
        <div class="speed-control">
          <span>speed</span>
          <input
            v-model.number="speed"
            type="range"
            min="0"
            max="3"
            step="0.1"
          >
        </div>
        <label class="control-toggle">
          <input v-model="dither" type="checkbox">
          <span>dither</span>
        </label>
        <label class="control-toggle">
          <input v-model="invert" type="checkbox">
          <span>invert</span>
        </label>
      </div>
    </header>

    <div class="gallery">
      <div
        v-for="name in patternNames"
        :key="name"
        class="card"
        @click="openExpanded(name)"
      >
        <canvas :ref="(el) => setThumbRef(name, el as HTMLCanvasElement)" />
        <div class="label">
          <span class="name">{{ name }}</span>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="expandedPattern"
        class="expanded-overlay"
        @click="expandedPattern = null"
      >
        <canvas ref="expandedCanvasRef" width="576" height="400" />
        <div class="info">
          <span class="name">{{ expandedPattern }}</span>
          <span class="hint">click anywhere to close</span>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { patterns, patternNames, renderPattern, randomizeSeed } from '~/composables/patterns'

const THUMB_W = 192
const THUMB_H = 133
const FULL_W = 576
const FULL_H = 400

const speed = ref(1)
const dither = ref(true)
const invert = ref(false)
const expandedPattern = ref<string | null>(null)
const expandedCanvasRef = ref<HTMLCanvasElement | null>(null)

const thumbRefs = new Map<string, HTMLCanvasElement>()
const thumbCtxs = new Map<string, CanvasRenderingContext2D>()

function setThumbRef(name: string, el: HTMLCanvasElement | null) {
  if (!el) {
    thumbRefs.delete(name)
    thumbCtxs.delete(name)
    return
  }
  el.width = THUMB_W
  el.height = THUMB_H
  thumbRefs.set(name, el)
  const ctx = el.getContext('2d')
  if (ctx) thumbCtxs.set(name, ctx)
}

function openExpanded(name: string) {
  expandedPattern.value = name
}

let time = Math.random() * 500 + 50
let lastFrame = 0
let frameCount = 0
let rafId = 0

function frame(now: number) {
  const dt = lastFrame ? (now - lastFrame) / 1000 : 0.016
  lastFrame = now
  time += dt * speed.value

  const names = patternNames
  const idx = frameCount % names.length
  const name = names[idx]
  const ctx = thumbCtxs.get(name)
  if (ctx) {
    renderPattern(ctx, patterns[name], THUMB_W, THUMB_H, time, dither.value, invert.value)
  }
  frameCount++

  if (expandedPattern.value && expandedCanvasRef.value) {
    const expCtx = expandedCanvasRef.value.getContext('2d')
    if (expCtx) {
      renderPattern(expCtx, patterns[expandedPattern.value], FULL_W, FULL_H, time, dither.value, invert.value)
    }
  }

  rafId = requestAnimationFrame(frame)
}

onMounted(() => {
  randomizeSeed()
  rafId = requestAnimationFrame(frame)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.pattern-page {
  min-height: 100vh;
  background: var(--color-background);
}

.pattern-header {
  padding: 40px 32px 24px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
}

.pattern-title {
  display: flex;
  align-items: baseline;
  gap: 16px;
}

.back-link {
  color: var(--color-text-tertiary);
  text-decoration: none;
  font-size: 18px;
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--color-text-primary);
}

.pattern-header h1 {
  font-size: 14px;
  font-weight: 400;
  color: var(--color-text-primary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-family: var(--font-mono);
}

.subtitle {
  color: var(--color-text-tertiary);
  font-size: 12px;
  font-family: var(--font-mono);
}

.controls {
  margin-left: auto;
  display: flex;
  gap: 12px;
  align-items: center;
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: var(--font-mono);
}

.speed-control input[type="range"] {
  width: 80px;
  height: 2px;
  appearance: none;
  background: var(--color-border);
  outline: none;
}

.speed-control input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 10px;
  height: 10px;
  background: var(--color-text-secondary);
  border-radius: 0;
  cursor: pointer;
}

.control-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
  font-size: 11px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: var(--font-mono);
}

.control-toggle input[type="checkbox"] {
  appearance: none;
  width: 14px;
  height: 14px;
  border: 1px solid var(--color-text-tertiary);
  background: transparent;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
}

.control-toggle input[type="checkbox"]:checked {
  border-color: var(--color-text-primary);
}

.control-toggle input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background: var(--color-text-primary);
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1px;
  background: var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.card {
  background: var(--color-background);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background var(--transition-base);
}

.card:hover {
  background: var(--color-surface);
}

.card canvas {
  display: block;
  width: 100%;
  aspect-ratio: 576 / 400;
  image-rendering: pixelated;
}

.card .label {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card .label .name {
  font-size: 12px;
  color: var(--color-text-secondary);
  letter-spacing: 0.04em;
  font-family: var(--font-mono);
}

.expanded-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 16px;
}

.expanded-overlay canvas {
  max-width: 90vw;
  max-height: 75vh;
  image-rendering: pixelated;
  border: 1px solid var(--color-border);
}

.expanded-overlay .info {
  display: flex;
  gap: 24px;
  align-items: center;
}

.expanded-overlay .info .name {
  font-size: 16px;
  color: #fff;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-family: var(--font-mono);
}

.expanded-overlay .info .hint {
  font-size: 11px;
  color: var(--color-text-tertiary);
  font-family: var(--font-mono);
}

@media (max-width: 640px) {
  .pattern-header {
    padding: 24px 16px 16px;
    flex-direction: column;
    gap: 12px;
  }

  .controls {
    margin-left: 0;
    flex-wrap: wrap;
  }

  .gallery {
    grid-template-columns: 1fr;
  }
}
</style>
