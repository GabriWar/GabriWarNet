import {
  FilesetResolver,
  GestureRecognizer,
  DrawingUtils,
  type GestureRecognizerResult,
  type NormalizedLandmark,
} from '@mediapipe/tasks-vision'

const WASM_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task'
const DWELL_MS = 1500
const SMOOTH = 0.3

// Finger landmark indices: [tip, dip, pip]
const FINGER_JOINTS: [number, number, number][] = [
  [8, 7, 6],   // index
  [12, 11, 10], // middle
  [16, 15, 14], // ring
  [20, 19, 18], // pinky
]

function countFingers(landmarks: NormalizedLandmark[], handedness: string): number {
  let count = 0

  // Thumb: x-axis comparison depends on hand
  const thumbTip = landmarks[4]!
  const thumbIp = landmarks[3]!
  if (handedness === 'Left') {
    if (thumbTip.x > thumbIp.x) count++
  } else {
    if (thumbTip.x < thumbIp.x) count++
  }

  // Fingers: tip above DIP above PIP (y axis is inverted — lower y = higher)
  for (const [tip, dip, pip] of FINGER_JOINTS) {
    if (landmarks[tip]!.y < landmarks[dip]!.y && landmarks[dip]!.y < landmarks[pip]!.y) {
      count++
    }
  }

  return count
}

export function useHandTracking() {
  const videoRef = ref<HTMLVideoElement | null>(null)
  const canvasRef = ref<HTMLCanvasElement | null>(null)

  const isRunning = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isFlipped = ref(true)

  const gesture = ref<{ name: string; confidence: number } | null>(null)
  const fingerCounts = ref({ left: 0, right: 0 })
  const cursorPos = ref({ x: 0, y: 0, visible: false })
  const dwellProgress = ref(0)
  const dwellTarget = ref<HTMLElement | null>(null)

  const showLandmarks = ref(true)
  const showConnectors = ref(true)
  const showCursor = ref(true)
  const showGestureInfo = ref(true)
  const showFingerCount = ref(true)

  let recognizer: GestureRecognizer | null = null
  let drawingUtils: DrawingUtils | null = null
  let stream: MediaStream | null = null
  let rafId = 0
  let lastVideoTime = -1
  let tempCanvas: HTMLCanvasElement | null = null
  let tempCtx: CanvasRenderingContext2D | null = null

  // Cursor smoothing
  let smoothX = 0
  let smoothY = 0

  // Dwell state
  let dwellStartTime = 0
  let currentDwellEl: HTMLElement | null = null

  async function initMediaPipe() {
    isLoading.value = true
    error.value = null
    try {
      const vision = await FilesetResolver.forVisionTasks(WASM_CDN)
      recognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 2,
      })
    } catch (e) {
      error.value = `Failed to load MediaPipe: ${e}`
    }
    isLoading.value = false
  }

  async function startCamera() {
    if (!videoRef.value) return
    error.value = null

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
      })
    } catch {
      error.value = 'Camera access denied. Please allow camera permissions.'
      return
    }

    // Re-check ref after async getUserMedia (could be null after HMR)
    if (!videoRef.value) {
      for (const track of stream.getTracks()) track.stop()
      stream = null
      return
    }

    const video = videoRef.value
    video.srcObject = stream
    await new Promise<void>((resolve) => {
      video.onloadedmetadata = () => {
        video.play()
        resolve()
      }
    })

    const vw = video.videoWidth
    const vh = video.videoHeight

    if (canvasRef.value) {
      canvasRef.value.width = vw
      canvasRef.value.height = vh
    }

    // Reusable temp canvas for unflipped detection
    tempCanvas = document.createElement('canvas')
    tempCanvas.width = vw
    tempCanvas.height = vh
    tempCtx = tempCanvas.getContext('2d')!

    if (canvasRef.value) {
      const ctx = canvasRef.value.getContext('2d')!
      drawingUtils = new DrawingUtils(ctx)
    }

    isRunning.value = true
    lastVideoTime = -1
    rafId = requestAnimationFrame(loop)
  }

  function stopCamera() {
    isRunning.value = false
    cancelAnimationFrame(rafId)
    if (stream) {
      for (const track of stream.getTracks()) track.stop()
      stream = null
    }
    if (videoRef.value) videoRef.value.srcObject = null
    cursorPos.value = { x: 0, y: 0, visible: false }
    resetDwell()
  }

  function loop() {
    if (!isRunning.value) return
    rafId = requestAnimationFrame(loop)

    if (!videoRef.value || !canvasRef.value || !recognizer) return

    const video = videoRef.value
    if (video.currentTime === lastVideoTime) return
    lastVideoTime = video.currentTime

    const ctx = canvasRef.value.getContext('2d')!
    const vw = video.videoWidth
    const vh = video.videoHeight

    // Draw video frame to visible canvas
    ctx.save()
    if (isFlipped.value) {
      ctx.scale(-1, 1)
      ctx.drawImage(video, -vw, 0, vw, vh)
    } else {
      ctx.drawImage(video, 0, 0, vw, vh)
    }
    ctx.restore()

    // Draw unflipped frame to temp canvas for detection
    tempCtx!.drawImage(video, 0, 0, vw, vh)

    let results: GestureRecognizerResult
    try {
      results = recognizer.recognizeForVideo(tempCanvas!, performance.now())
    } catch {
      return
    }

    processResults(results, ctx, vw, vh)
    updateDwell()
  }

  function processResults(
    results: GestureRecognizerResult,
    ctx: CanvasRenderingContext2D,
    vw: number,
    vh: number,
  ) {
    // Gesture
    if (results.gestures && results.gestures.length > 0 && results.gestures[0]!.length > 0) {
      const g = results.gestures[0]![0]!
      gesture.value = { name: g.categoryName, confidence: Math.round(g.score * 100) }
    } else {
      gesture.value = null
    }

    // Finger counts
    const counts = { left: 0, right: 0 }
    if (results.landmarks && results.handednesses) {
      for (let i = 0; i < results.landmarks.length; i++) {
        const hand = results.handednesses[i]![0]!.categoryName
        const lm = results.landmarks[i]!
        const c = countFingers(lm, hand)
        // MediaPipe reports mirrored handedness
        if (hand === 'Left') counts.right = c
        else counts.left = c
      }
    }
    fingerCounts.value = counts

    // Draw skeleton
    if (results.landmarks && drawingUtils) {
      for (const landmarks of results.landmarks) {
        ctx.save()
        if (isFlipped.value) {
          ctx.scale(-1, 1)
          ctx.translate(-vw, 0)
        }

        if (showConnectors.value) {
          drawingUtils.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, {
            color: '#00FF00',
            lineWidth: 4,
          })
        }
        if (showLandmarks.value) {
          drawingUtils.drawLandmarks(landmarks, {
            color: '#FF0000',
            lineWidth: 2,
          })
        }

        ctx.restore()
      }
    }

    // Cursor from first hand's index fingertip
    if (results.landmarks && results.landmarks.length > 0 && showCursor.value) {
      const lm = results.landmarks[0]!
      const tip = lm[8]!
      const rawX = isFlipped.value ? (1 - tip.x) : tip.x
      const rawY = tip.y

      const targetX = rawX * window.innerWidth
      const targetY = rawY * window.innerHeight

      smoothX = smoothX * (1 - SMOOTH) + targetX * SMOOTH
      smoothY = smoothY * (1 - SMOOTH) + targetY * SMOOTH

      cursorPos.value = { x: smoothX, y: smoothY, visible: true }
    } else {
      cursorPos.value = { ...cursorPos.value, visible: false }
    }
  }

  function updateDwell() {
    if (!cursorPos.value.visible) {
      resetDwell()
      return
    }

    const el = document.elementFromPoint(cursorPos.value.x, cursorPos.value.y)
    const clickable = el?.closest('[data-dwell]') as HTMLElement | null

    if (!clickable || clickable !== currentDwellEl) {
      resetDwell()
      if (clickable) {
        currentDwellEl = clickable
        dwellTarget.value = clickable
        dwellStartTime = performance.now()
      }
      return
    }

    const elapsed = performance.now() - dwellStartTime
    dwellProgress.value = Math.min(1, elapsed / DWELL_MS)

    if (dwellProgress.value >= 1) {
      clickable.click()
      resetDwell()
    }
  }

  function resetDwell() {
    dwellProgress.value = 0
    dwellTarget.value = null
    currentDwellEl = null
    dwellStartTime = 0
  }

  async function toggleCamera() {
    if (isRunning.value) {
      stopCamera()
    } else {
      await startCamera()
    }
  }

  function toggleMirror() {
    isFlipped.value = !isFlipped.value
  }

  async function init() {
    await initMediaPipe()
    if (!error.value) {
      await startCamera()
    }
  }

  function destroy() {
    stopCamera()
    if (recognizer) {
      recognizer.close()
      recognizer = null
    }
    drawingUtils = null
    tempCanvas = null
    tempCtx = null
  }

  return {
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
    dwellTarget,
    showLandmarks,
    showConnectors,
    showCursor,
    showGestureInfo,
    showFingerCount,
    init,
    destroy,
    toggleCamera,
    toggleMirror,
  }
}
