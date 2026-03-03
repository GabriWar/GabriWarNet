<script setup lang="ts">
const props = defineProps<{
  minDuration?: number
}>()

const emit = defineEmits(['finished'])
const progress = ref(0)
const isVisible = ref(true)

onMounted(() => {
  // Skip if already shown this session
  if (sessionStorage.getItem('loadingShown')) {
    isVisible.value = false
    emit('finished')
    return
  }

  sessionStorage.setItem('loadingShown', '1')

  // Disable scrolling while loading
  document.body.style.overflow = 'hidden'

  const startTime = Date.now()
  const duration = props.minDuration || 1500

  const updateProgress = () => {
    const elapsed = Date.now() - startTime
    const calculatedProgress = Math.min((elapsed / duration) * 100, 100)

    progress.value = calculatedProgress

    if (calculatedProgress < 100) {
      requestAnimationFrame(updateProgress)
    } else {
      finishLoading()
    }
  }

  requestAnimationFrame(updateProgress)
})

const finishLoading = async () => {
  // Wait a tiny bit at 100%
  await new Promise(resolve => setTimeout(resolve, 200))

  if (!document.startViewTransition) {
    isVisible.value = false
    cleanup()
    return
  }

  // Set transition origin to center
  document.documentElement.style.setProperty('--click-x', '50%')
  document.documentElement.style.setProperty('--click-y', '50%')

  const transition = document.startViewTransition(async () => {
    isVisible.value = false
    await nextTick()
  })

  await transition.finished
  cleanup()
}

const cleanup = () => {
  document.body.style.overflow = ''
  emit('finished')
}
</script>

<template>
  <div v-if="isVisible" class="loading-screen">
    <div class="progress-container">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
    <div class="percentage">{{ Math.round(progress) }}%</div>
  </div>
</template>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000000;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.progress-container {
  width: 300px;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.2);
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #ffffff;
  transition: width 0.1s linear;
}

.percentage {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  opacity: 0.5;
  font-variant-numeric: tabular-nums;
}
</style>
