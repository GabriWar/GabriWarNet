<script setup lang="ts">
const {
  preRef,
  running,
  raining,
  init,
  destroy,
  resize,
  reset,
  start,
  stop,
  toggleRain,
  addCharsAt,
  eraseArea,
  pixelToGrid,
  addText,
} = useAsciiEngine()

const typingBuffer = ref('')
let isDrawing = false
let isErasing = false
let typingTimeout: ReturnType<typeof setTimeout> | null = null

function onPointerDown(e: PointerEvent) {
  if (e.button === 2) {
    isErasing = true
    const [gx, gy] = pixelToGrid(e.clientX, e.clientY)
    eraseArea(gx, gy, 2)
    return
  }
  isDrawing = true
  const [gx, gy] = pixelToGrid(e.clientX, e.clientY)
  addCharsAt(gx, gy, 2)
}

function onPointerMove(e: PointerEvent) {
  if (isDrawing) {
    const [gx, gy] = pixelToGrid(e.clientX, e.clientY)
    addCharsAt(gx, gy, 2)
  } else if (isErasing) {
    const [gx, gy] = pixelToGrid(e.clientX, e.clientY)
    eraseArea(gx, gy, 2)
  }
}

function onPointerUp() {
  isDrawing = false
  isErasing = false
}

function commitText() {
  if (!typingBuffer.value) return
  const x = Math.floor(Math.random() * 20)
  const y = Math.floor(Math.random() * 5)
  addText(typingBuffer.value, x, y, false)
  typingBuffer.value = ''
  if (typingTimeout) clearTimeout(typingTimeout)
  typingTimeout = null
}

function onKeyDown(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey || e.altKey) return

  if (e.key === 'Enter') {
    commitText()
    return
  }
  if (e.key === 'Backspace') {
    typingBuffer.value = typingBuffer.value.slice(0, -1)
    return
  }
  if (e.key === 'Escape') {
    typingBuffer.value = ''
    if (typingTimeout) clearTimeout(typingTimeout)
    typingTimeout = null
    return
  }
  if (e.key.length === 1) {
    typingBuffer.value += e.key
    // Auto-commit after 3 seconds of inactivity
    if (typingTimeout) clearTimeout(typingTimeout)
    typingTimeout = setTimeout(commitText, 3000)
  }
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  init()
  resizeObserver = new ResizeObserver(() => resize())
  if (preRef.value) resizeObserver.observe(preRef.value)
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  destroy()
  resizeObserver?.disconnect()
  window.removeEventListener('keydown', onKeyDown)
  if (typingTimeout) clearTimeout(typingTimeout)
})
</script>

<template>
  <div
    class="ascii-page"
    @contextmenu.prevent
  >
    <pre
      ref="preRef"
      class="ascii-display"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointerleave="onPointerUp"
    />

    <div v-if="typingBuffer" class="typing-preview">
      {{ typingBuffer }}<span class="cursor">|</span>
    </div>

    <div class="ascii-controls">
      <button :class="{ active: running }" @click="running ? stop() : start()">
        {{ running ? 'Stop' : 'Start' }}
      </button>
      <button @click="reset">Reset</button>
      <button :class="{ active: raining }" @click="toggleRain">
        Rain {{ raining ? 'On' : 'Off' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.ascii-page {
  position: fixed;
  inset: 0;
  background: var(--color-background);
  overflow: hidden;
}

.ascii-display {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1;
  color: var(--color-text-primary);
  background: transparent;
  cursor: crosshair;
  user-select: none;
  overflow: hidden;
}

.typing-preview {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.2rem;
  color: var(--color-text-primary);
  background: color-mix(in srgb, var(--color-surface) 85%, transparent);
  border: 1px solid var(--color-border);
  padding: 8px 16px;
  border-radius: var(--radius-md);
  pointer-events: none;
  z-index: 100;
}

.typing-preview .cursor {
  animation: blink 1s step-end infinite;
  color: var(--color-primary);
}

@keyframes blink {
  50% { opacity: 0; }
}

.ascii-controls {
  position: fixed;
  bottom: 64px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  z-index: 10;
}

.ascii-controls button {
  font-family: 'Courier New', Courier, monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-tertiary);
  background: transparent;
  border: 1px solid var(--color-border);
  padding: 6px 14px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.ascii-controls button:hover {
  color: var(--color-text-primary);
  border-color: var(--color-text-tertiary);
}

.ascii-controls button.active {
  color: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: 0 0 8px color-mix(in srgb, var(--color-primary) 30%, transparent);
}
</style>
