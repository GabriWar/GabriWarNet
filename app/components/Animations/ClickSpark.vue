<template>
  <div ref="containerRef" class="click-spark-container" @click="handleClick">
    <canvas ref="canvasRef" class="click-spark-canvas" />

    <slot />
  </div>
</template>

<style scoped>
.click-spark-container {
  position: relative;
  width: 100%;
}

.click-spark-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 999999;
}
</style>

<script setup lang="ts">
interface Spark {
  x: number
  y: number
  angle: number
  startTime: number
}

interface Props {
  sparkColor?: string
  sparkSize?: number
  sparkRadius?: number
  sparkCount?: number
  duration?: number
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
  extraScale?: number
}

const props = withDefaults(defineProps<Props>(), {
  sparkColor: '#fff',
  sparkSize: 10,
  sparkRadius: 15,
  sparkCount: 8,
  duration: 400,
  easing: 'ease-out',
  extraScale: 1.0
})

const containerRef = useTemplateRef<HTMLDivElement>('containerRef')
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef')
const sparks = ref<Spark[]>([])
const startTimeRef = ref<number | null>(null)
const animationId = ref<number | null>(null)

const easeFunc = computed(() => {
  return (t: number) => {
    switch (props.easing) {
      case 'linear':
        return t
      case 'ease-in':
        return t * t
      case 'ease-in-out':
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      default:
        return t * (2 - t)
    }
  }
})

const handleClick = (e: MouseEvent) => {
  const canvas = canvasRef.value
  if (!canvas) return

  // Use clientX/Y directly since canvas is fixed position
  const x = e.clientX
  const y = e.clientY

  const now = performance.now()

  // Random spark count between 6 and 16
  const actualSparkCount = Math.floor(Math.random() * 11) + 6

  // Random base rotation offset for variety on each click
  const rotationOffset = Math.random() * Math.PI * 2

  const newSparks: Spark[] = Array.from({ length: actualSparkCount }, (_, i) => {
    // Add individual random angle variation to each spark
    const baseAngle = (2 * Math.PI * i) / actualSparkCount
    const angleVariation = (Math.random() - 0.5) * 0.4 // ±0.2 radians variation

    return {
      x,
      y,
      angle: baseAngle + rotationOffset + angleVariation,
      startTime: now
    }
  })

  sparks.value.push(...newSparks)

  // Start the draw loop if not already running
  if (!animationId.value) {
    animationId.value = requestAnimationFrame(draw)
  }
}

const draw = (timestamp: number) => {
  if (!startTimeRef.value) {
    startTimeRef.value = timestamp
  }

  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!ctx || !canvas) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  sparks.value = sparks.value.filter((spark: Spark) => {
    const elapsed = timestamp - spark.startTime
    if (elapsed >= props.duration) {
      return false
    }

    const progress = elapsed / props.duration
    const eased = easeFunc.value(progress)

    const distance = eased * props.sparkRadius * props.extraScale
    const lineLength = props.sparkSize * (1 - eased)

    const x1 = spark.x + distance * Math.cos(spark.angle)
    const y1 = spark.y + distance * Math.sin(spark.angle)
    const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle)
    const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle)

    ctx.strokeStyle = props.sparkColor
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()

    return true
  })

  // Only keep looping while there are active sparks
  if (sparks.value.length > 0) {
    animationId.value = requestAnimationFrame(draw)
  } else {
    animationId.value = null
  }
}

const resizeCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const width = window.innerWidth
  const height = window.innerHeight

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }
}

let resizeTimeout: number

const handleResize = () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(resizeCanvas, 100)
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  resizeCanvas()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  clearTimeout(resizeTimeout)

  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
})

watch(
  [
    () => props.sparkColor,
    () => props.sparkSize,
    () => props.sparkRadius,
    () => props.sparkCount,
    () => props.duration,
    easeFunc,
    () => props.extraScale
  ],
  () => {
    // Only restart loop if there are active sparks
    if (sparks.value.length > 0 && !animationId.value) {
      animationId.value = requestAnimationFrame(draw)
    }
  }
)
</script>
