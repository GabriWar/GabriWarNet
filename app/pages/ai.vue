<script setup lang="ts">
const {
  videoRef,
  canvasRef,
  isRunning,
  isLoading,
  error,
  isFlipped,
  gesture,
  fingerCounts,
  cursorPos,
  dwellProgress,
  showLandmarks,
  showConnectors,
  showCursor,
  showGestureInfo,
  showFingerCount,
  init,
  destroy,
  toggleCamera,
  toggleMirror,
} = useHandTracking()

const bgColor = ref('')
const clickCount = ref(0)
const infoVisible = ref(false)

function changeBg() {
  const hue = Math.floor(Math.random() * 360)
  bgColor.value = `hsl(${hue}, 40%, 15%)`
  clickCount.value++
}

function toggleInfo() {
  infoVisible.value = !infoVisible.value
  clickCount.value++
}

function incrementCount() {
  clickCount.value++
}

onMounted(() => init())
onUnmounted(() => destroy())
</script>

<template>
  <div class="ai-page" :style="bgColor ? { background: bgColor } : {}">
    <!-- Loading -->
    <div v-if="isLoading" class="ai-loading">
      <div class="ai-spinner" />
      <span>Loading MediaPipe...</span>
    </div>

    <!-- Error -->
    <div v-if="error" class="ai-error">
      {{ error }}
    </div>

    <!-- Viewport: video + skeleton canvas -->
    <div class="ai-viewport">
      <video
        ref="videoRef"
        autoplay
        playsinline
        muted
        class="ai-video"
      />
      <canvas
        ref="canvasRef"
        class="ai-canvas"
        :class="{ flipped: isFlipped }"
      />
    </div>

    <!-- Info panel -->
    <div v-if="(showGestureInfo || showFingerCount) && isRunning" class="ai-info">
      <template v-if="showGestureInfo && gesture">
        <div class="ai-info-row">
          <span class="ai-info-label">Gesture</span>
          <span class="ai-info-value">{{ gesture.name }}</span>
        </div>
        <div class="ai-info-row">
          <span class="ai-info-label">Confidence</span>
          <div class="ai-confidence-bar">
            <div class="ai-confidence-fill" :style="{ width: gesture.confidence + '%' }" />
          </div>
          <span class="ai-info-value">{{ gesture.confidence }}%</span>
        </div>
      </template>
      <template v-if="showFingerCount && isRunning">
        <div class="ai-info-row">
          <span class="ai-info-label">Fingers</span>
          <span class="ai-info-value">L: {{ fingerCounts.left }} R: {{ fingerCounts.right }}</span>
        </div>
      </template>
    </div>

    <!-- Demo buttons -->
    <div v-if="isRunning" class="ai-demo">
      <button data-dwell class="ai-demo-btn" @click="changeBg">
        Change Color
      </button>
      <button data-dwell class="ai-demo-btn" @click="toggleInfo">
        {{ infoVisible ? 'Hide' : 'Show' }} Card
      </button>
      <button data-dwell class="ai-demo-btn" @click="incrementCount">
        Clicks: {{ clickCount }}
      </button>
    </div>

    <!-- Info card -->
    <div v-if="infoVisible" class="ai-card">
      <h3>Hand Tracking</h3>
      <p>Point your index finger to control the cursor. Hold it over a button to click.</p>
    </div>

    <!-- Finger cursor -->
    <div
      v-if="cursorPos.visible && showCursor && isRunning"
      class="ai-cursor"
      :style="{ transform: `translate(${cursorPos.x - 20}px, ${cursorPos.y - 20}px)` }"
    >
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="3" />
        <circle
          cx="20" cy="20" r="16"
          fill="none"
          stroke="#0f0"
          stroke-width="3"
          stroke-linecap="round"
          :stroke-dasharray="100.53"
          :stroke-dashoffset="100.53 * (1 - dwellProgress)"
          transform="rotate(-90 20 20)"
        />
      </svg>
      <div class="ai-cursor-dot" />
    </div>

    <!-- Controls -->
    <div class="ai-controls">
      <button :class="{ active: isRunning }" @click="toggleCamera">
        {{ isRunning ? 'Camera Off' : 'Camera On' }}
      </button>
      <button :class="{ active: isFlipped }" @click="toggleMirror">
        Mirror
      </button>
      <button :class="{ active: showLandmarks }" @click="showLandmarks = !showLandmarks">
        Joints
      </button>
      <button :class="{ active: showConnectors }" @click="showConnectors = !showConnectors">
        Bones
      </button>
      <button :class="{ active: showCursor }" @click="showCursor = !showCursor">
        Cursor
      </button>
      <button :class="{ active: showGestureInfo }" @click="showGestureInfo = !showGestureInfo">
        Gesture
      </button>
      <button :class="{ active: showFingerCount }" @click="showFingerCount = !showFingerCount">
        Fingers
      </button>
    </div>
  </div>
</template>

<style scoped>
.ai-page {
  position: fixed;
  inset: 0;
  background: var(--color-background);
  overflow: hidden;
  transition: background 0.5s ease;
}

.ai-viewport {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ai-video {
  display: none;
}

.ai-canvas {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.ai-canvas.flipped {
  transform: scaleX(-1);
}

/* Loading */
.ai-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  color: var(--color-text-secondary);
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  z-index: 20;
}

.ai-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error */
.ai-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-error);
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  text-align: center;
  padding: 20px;
  z-index: 20;
}

/* Info panel */
.ai-info {
  position: fixed;
  top: 16px;
  left: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  z-index: 10;
  min-width: 180px;
}

.ai-info-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-info-label {
  font-family: 'Courier New', Courier, monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-tertiary);
  min-width: 70px;
}

.ai-info-value {
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
  color: var(--color-primary);
}

.ai-confidence-bar {
  flex: 1;
  height: 4px;
  background: var(--color-border);
  border-radius: 2px;
  overflow: hidden;
}

.ai-confidence-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.15s ease;
}

/* Demo buttons */
.ai-demo {
  position: fixed;
  top: 50%;
  right: 24px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 10;
}

.ai-demo-btn {
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
  color: var(--color-text-secondary);
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  padding: 14px 24px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.15s ease;
  min-width: 140px;
  text-align: center;
}

.ai-demo-btn:hover {
  color: var(--color-text-primary);
  border-color: var(--color-primary);
  box-shadow: 0 0 12px color-mix(in srgb, var(--color-primary) 30%, transparent);
}

/* Info card */
.ai-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 24px 32px;
  background: color-mix(in srgb, var(--color-surface) 85%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text-secondary);
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
  z-index: 15;
  max-width: 320px;
  text-align: center;
}

.ai-card h3 {
  font-size: 16px;
  color: var(--color-primary);
  margin-bottom: 8px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.ai-card p {
  line-height: 1.6;
}

/* Cursor */
.ai-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  z-index: 9999;
  pointer-events: none;
  will-change: transform;
}

.ai-cursor-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  background: #0f0;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 6px rgba(0, 255, 0, 0.6);
}

/* Controls */
.ai-controls {
  position: fixed;
  bottom: 64px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  padding: 8px 12px;
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  z-index: 10;
  flex-wrap: wrap;
  justify-content: center;
}

.ai-controls button {
  font-family: 'Courier New', Courier, monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-tertiary);
  background: transparent;
  border: 1px solid var(--color-border);
  padding: 5px 10px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.ai-controls button:hover {
  color: var(--color-text-primary);
  border-color: var(--color-text-tertiary);
}

.ai-controls button.active {
  color: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: 0 0 8px color-mix(in srgb, var(--color-primary) 30%, transparent);
}

@media (max-width: 640px) {
  .ai-demo {
    right: 12px;
  }

  .ai-demo-btn {
    padding: 10px 16px;
    font-size: 11px;
    min-width: auto;
  }

  .ai-info {
    top: 8px;
    left: 8px;
    padding: 8px 12px;
  }

  .ai-controls {
    bottom: 54px;
    gap: 4px;
    padding: 6px 8px;
  }

  .ai-controls button {
    font-size: 9px;
    padding: 4px 8px;
  }
}
</style>
