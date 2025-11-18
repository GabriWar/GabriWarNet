<script setup lang="ts">
import * as THREE from 'three'

const containerRef = ref<HTMLElement | null>(null)
let asciiInstance: CanvAscii | null = null

const texts = ['GabriWar', 'GABRIEL!', '_GUERRA_']
const currentIndex = ref(0)

// Dev controls
const asciiFontSize = ref(17)
const textFontSize = ref(155)
const planeBaseHeight = ref(5)
const showControls = ref(false)
const hasInitialized = ref(false)

// Random gradient colors
const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, ${70 + Math.random() * 30}%, ${50 + Math.random() * 20}%)`
}

const gradientColor1 = ref('')
const gradientColor2 = ref('')
const gradientColor3 = ref('')

const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float mouse;
uniform float uEnableWaves;

void main() {
    vUv = uv;
    float time = uTime * 5.;

    float waveFactor = uEnableWaves;

    vec3 transformed = position;

    transformed.x += sin(time + position.y) * 0.5 * waveFactor;
    transformed.y += cos(time + position.z) * 0.15 * waveFactor;
    transformed.z += sin(time + position.x) * waveFactor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`

const fragmentShader = `
varying vec2 vUv;
uniform float mouse;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
    float time = uTime;
    vec2 pos = vUv;

    float move = sin(time + mouse) * 0.01;
    float r = texture2D(uTexture, pos + cos(time * 2. - time + pos.x) * .01).r;
    float g = texture2D(uTexture, pos + tan(time * .5 + pos.x - time) * .01).g;
    float b = texture2D(uTexture, pos - cos(time * 2. + time + pos.y) * .01).b;
    float a = texture2D(uTexture, pos).a;
    gl_FragColor = vec4(r, g, b, a);
}
`

const map = (n: number, start: number, stop: number, start2: number, stop2: number) => {
  return ((n - start) / (stop - start)) * (stop2 - start2) + start2
}

const PX_RATIO = typeof window !== 'undefined' ? window.devicePixelRatio : 1

class AsciiFilter {
  renderer: THREE.WebGLRenderer
  domElement: HTMLDivElement
  pre: HTMLPreElement
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  deg: number
  invert: boolean
  fontSize: number
  fontFamily: string
  charset: string
  width: number = 0
  height: number = 0
  cols: number = 0
  rows: number = 0
  center: { x: number; y: number } = { x: 0, y: 0 }
  mouse: { x: number; y: number } = { x: 0, y: 0 }
  gradientColors: { color1: string; color2: string; color3: string }

  constructor(renderer: THREE.WebGLRenderer, { fontSize, fontFamily, charset, invert, gradientColors }: any = {}) {
    this.renderer = renderer
    this.domElement = document.createElement('div')
    this.domElement.style.position = 'absolute'
    this.domElement.style.top = '0'
    this.domElement.style.left = '0'
    this.domElement.style.width = '100%'
    this.domElement.style.height = '100%'

    this.pre = document.createElement('pre')
    this.domElement.appendChild(this.pre)

    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')!
    this.domElement.appendChild(this.canvas)

    this.deg = 0
    this.invert = invert ?? true
    this.fontSize = fontSize ?? 12
    this.fontFamily = fontFamily ?? "'Courier New', monospace"
    this.charset = charset ?? ' .\'`^",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$'
    this.gradientColors = gradientColors ?? { color1: '#ff6188', color2: '#fc9867', color3: '#ffd866' }

    this.context.imageSmoothingEnabled = false

    this.onMouseMove = this.onMouseMove.bind(this)
    document.addEventListener('mousemove', this.onMouseMove)
  }

  setSize(width: number, height: number) {
    this.width = width
    this.height = height
    this.renderer.setSize(width, height)
    this.reset()

    this.center = { x: width / 2, y: height / 2 }
    this.mouse = { x: this.center.x, y: this.center.y }
  }

  reset() {
    this.context.font = `${this.fontSize}px ${this.fontFamily}`

    const testChar = 'M'
    const charMetrics = this.context.measureText(testChar)
    const charWidth = charMetrics.width

    this.cols = Math.floor(this.width / charWidth)
    this.rows = Math.floor(this.height / this.fontSize)

    this.canvas.width = this.cols
    this.canvas.height = this.rows

    const totalWidth = this.cols * charWidth
    const totalHeight = this.rows * this.fontSize
    const offsetX = (this.width - totalWidth) / 2
    const offsetY = (this.height - totalHeight) / 2

    this.pre.style.fontFamily = this.fontFamily
    this.pre.style.fontSize = `${this.fontSize}px`
    this.pre.style.margin = '0'
    this.pre.style.padding = '0'
    this.pre.style.lineHeight = `${this.fontSize}px`
    this.pre.style.position = 'absolute'
    this.pre.style.left = `${offsetX}px`
    this.pre.style.top = `${offsetY}px`
    this.pre.style.width = `${totalWidth}px`
    this.pre.style.height = `${totalHeight}px`
    this.pre.style.letterSpacing = '0'
    this.pre.style.wordSpacing = '0'
    this.pre.style.whiteSpace = 'pre'
    this.pre.style.overflow = 'hidden'
    this.pre.style.zIndex = '9'
    this.pre.style.backgroundAttachment = 'fixed'
    this.pre.style.backgroundImage = `radial-gradient(circle, ${this.gradientColors.color1} 0%, ${this.gradientColors.color2} 50%, ${this.gradientColors.color3} 100%)`
    this.pre.style.webkitTextFillColor = 'transparent'
    this.pre.style.webkitBackgroundClip = 'text'
    this.pre.style.backgroundClip = 'text'
  }

  render(scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer.render(scene, camera)

    const w = this.canvas.width
    const h = this.canvas.height
    this.context.clearRect(0, 0, w, h)
    if (this.context && w && h) {
      this.context.drawImage(this.renderer.domElement, 0, 0, w, h)
    }

    this.asciify(this.context, w, h)
    this.hue()
  }

  onMouseMove(e: MouseEvent) {
    this.mouse = { x: e.clientX * PX_RATIO, y: e.clientY * PX_RATIO }
  }

  get dx() {
    return this.mouse.x - this.center.x
  }

  get dy() {
    return this.mouse.y - this.center.y
  }

  hue() {
    const deg = (Math.atan2(this.dy, this.dx) * 180) / Math.PI
    this.deg += (deg - this.deg) * 0.075
    this.domElement.style.filter = `hue-rotate(${this.deg.toFixed(1)}deg)`
  }

  asciify(ctx: CanvasRenderingContext2D, w: number, h: number) {
    if (w && h) {
      const imgData = ctx.getImageData(0, 0, w, h).data
      let str = ''
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = x * 4 + y * 4 * w
          const [r, g, b, a] = [imgData[i], imgData[i + 1], imgData[i + 2], imgData[i + 3]]

          if (a === 0) {
            str += ' '
            continue
          }

          let gray = (0.3 * r + 0.6 * g + 0.1 * b) / 255
          let idx = Math.floor((1 - gray) * (this.charset.length - 1))
          if (this.invert) idx = this.charset.length - idx - 1
          str += this.charset[idx]
        }
        str += '\n'
      }
      this.pre.innerHTML = str
    }
  }

  dispose() {
    document.removeEventListener('mousemove', this.onMouseMove)
  }
}

class CanvasTxt {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  txt: string
  fontSize: number
  fontFamily: string
  color: string
  font: string

  constructor(txt: string, { fontSize = 200, fontFamily = 'Arial', color = '#fdf9f3' } = {}) {
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')!
    this.txt = txt
    this.fontSize = fontSize
    this.fontFamily = fontFamily
    this.color = color

    this.font = `600 ${this.fontSize}px ${this.fontFamily}`
  }

  resize() {
    this.context.font = this.font
    const metrics = this.context.measureText(this.txt)

    const textWidth = Math.ceil(metrics.width) + 20
    const textHeight = Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) + 20

    this.canvas.width = textWidth
    this.canvas.height = textHeight
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.fillStyle = this.color
    this.context.font = this.font

    const metrics = this.context.measureText(this.txt)
    const yPos = 10 + metrics.actualBoundingBoxAscent

    this.context.fillText(this.txt, 10, yPos)
  }

  get width() {
    return this.canvas.width
  }

  get height() {
    return this.canvas.height
  }

  get texture() {
    return this.canvas
  }
}

class CanvAscii {
  textString: string
  asciiFontSize: number
  textFontSize: number
  textColor: string
  planeBaseHeight: number
  container: HTMLElement
  width: number
  height: number
  enableWaves: boolean
  camera: THREE.PerspectiveCamera
  scene: THREE.Scene
  mouse: { x: number; y: number }
  textCanvas!: CanvasTxt
  texture!: THREE.CanvasTexture
  geometry!: THREE.PlaneGeometry
  material!: THREE.ShaderMaterial
  mesh!: THREE.Mesh
  renderer!: THREE.WebGLRenderer
  filter!: AsciiFilter
  center: { x: number; y: number }
  animationFrameId?: number
  gradientColors: { color1: string; color2: string; color3: string }

  constructor(
    { text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves, gradientColors, isLightMode }: any,
    containerElem: HTMLElement,
    width: number,
    height: number
  ) {
    this.textString = text
    this.asciiFontSize = asciiFontSize
    this.textFontSize = textFontSize
    this.textColor = textColor
    this.planeBaseHeight = planeBaseHeight
    this.container = containerElem
    this.width = width
    this.height = height
    this.enableWaves = enableWaves
    this.gradientColors = gradientColors


    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000)
    this.camera.position.z = 30

    this.scene = new THREE.Scene()
    this.mouse = { x: 0, y: 0 }
    this.center = { x: width / 2, y: height / 2 }

    this.onMouseMove = this.onMouseMove.bind(this)

    this.setMesh()
    this.setRenderer()
  }

  setMesh() {
    this.textCanvas = new CanvasTxt(this.textString, {
      fontSize: this.textFontSize,
      fontFamily: 'monospace',
      color: this.textColor
    })
    this.textCanvas.resize()
    this.textCanvas.render()

    this.texture = new THREE.CanvasTexture(this.textCanvas.texture)
    this.texture.minFilter = THREE.NearestFilter

    const textAspect = this.textCanvas.width / this.textCanvas.height
    const baseH = this.planeBaseHeight
    const planeW = baseH * textAspect
    const planeH = baseH

    this.geometry = new THREE.PlaneGeometry(planeW, planeH, 36, 36)
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        mouse: { value: 1.0 },
        uTexture: { value: this.texture },
        uEnableWaves: { value: this.enableWaves ? 1.0 : 0.0 }
      }
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    this.renderer.setPixelRatio(1)
    this.renderer.setClearColor(0x000000, 0)

    this.filter = new AsciiFilter(this.renderer, {
      fontFamily: 'monospace',
      fontSize: this.asciiFontSize,
      invert: true,
      gradientColors: this.gradientColors
    })

    this.container.appendChild(this.filter.domElement)
    this.setSize(this.width, this.height)

    this.container.addEventListener('mousemove', this.onMouseMove)
    this.container.addEventListener('touchmove', this.onMouseMove)
  }

  setSize(w: number, h: number) {
    this.width = w
    this.height = h

    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()

    this.filter.setSize(w, h)

    this.center = { x: w / 2, y: h / 2 }
  }

  load() {
    this.animate()
  }

  onMouseMove(evt: any) {
    const e = 'touches' in evt ? evt.touches[0] : evt
    const bounds = this.container.getBoundingClientRect()
    const x = e.clientX - bounds.left
    const y = e.clientY - bounds.top
    this.mouse = { x, y }
  }

  animate() {
    const animateFrame = () => {
      this.animationFrameId = requestAnimationFrame(animateFrame)
      this.render()
    }
    animateFrame()
  }

  render() {
    const time = new Date().getTime() * 0.001

    this.textCanvas.render()
    this.texture.needsUpdate = true
    ;(this.mesh.material as THREE.ShaderMaterial).uniforms.uTime.value = Math.sin(time)

    this.updateRotation()
    this.filter.render(this.scene, this.camera)
  }

  updateRotation() {
    const x = map(this.mouse.y, 0, this.height, 0.5, -0.5)
    const y = map(this.mouse.x, 0, this.width, -0.5, 0.5)

    this.mesh.rotation.x += (x - this.mesh.rotation.x) * 0.05
    this.mesh.rotation.y += (y - this.mesh.rotation.y) * 0.05
  }

  clear() {
    this.scene.traverse(obj => {
      if (obj instanceof THREE.Mesh && obj.material && obj.geometry) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose())
        } else {
          obj.material.dispose()
        }
        obj.geometry.dispose()
      }
    })
    this.scene.clear()
  }

  dispose() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }
    this.filter.dispose()
    this.container.removeChild(this.filter.domElement)
    this.container.removeEventListener('mousemove', this.onMouseMove)
    this.container.removeEventListener('touchmove', this.onMouseMove)
    this.clear()
    this.renderer.dispose()
  }
}

const createAsciiInstance = () => {
  if (!containerRef.value) return

  const { width, height } = containerRef.value.getBoundingClientRect()

  if (width === 0 || height === 0) return

  const textColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-text-primary') || '#fdf9f3'

  // Check if dark mode
  const theme = document.documentElement.getAttribute('data-theme')
  const isLightMode = theme === 'dark' // Inverted logic

  // Only randomize colors on first initialization
  if (!hasInitialized.value) {
    // Generate random gradient colors
    gradientColor1.value = getRandomColor()
    gradientColor2.value = getRandomColor()
    gradientColor3.value = getRandomColor()

    hasInitialized.value = true
  }

  asciiInstance = new CanvAscii(
    {
      text: texts[currentIndex.value],
      asciiFontSize: asciiFontSize.value,
      textFontSize: textFontSize.value,
      textColor,
      planeBaseHeight: planeBaseHeight.value,
      enableWaves: true,
      gradientColors: {
        color1: gradientColor1.value,
        color2: gradientColor2.value,
        color3: gradientColor3.value
      },
      isLightMode
    },
    containerRef.value,
    width,
    height
  )
  asciiInstance.load()
}

const recreateAscii = () => {
  if (asciiInstance) {
    asciiInstance.dispose()
  }
  createAsciiInstance()

  if (containerRef.value) {
    const ro = new ResizeObserver(entries => {
      if (!entries[0] || !asciiInstance) return
      const { width: w, height: h } = entries[0].contentRect
      if (w > 0 && h > 0) {
        asciiInstance.setSize(w, h)
      }
    })
    ro.observe(containerRef.value)
  }
}

const copyValues = () => {
  const values = `
asciiFontSize: ${asciiFontSize.value}
textFontSize: ${textFontSize.value}
planeBaseHeight: ${planeBaseHeight.value}
  `.trim()
  navigator.clipboard.writeText(values)
  alert('Values copied to clipboard!')
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === "'") {
    showControls.value = !showControls.value
  }
}

onMounted(() => {
  createAsciiInstance()

  if (containerRef.value) {
    const ro = new ResizeObserver(entries => {
      if (!entries[0] || !asciiInstance) return
      const { width: w, height: h } = entries[0].contentRect
      if (w > 0 && h > 0) {
        asciiInstance.setSize(w, h)
      }
    })
    ro.observe(containerRef.value)
  }

  window.addEventListener('keypress', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keypress', handleKeyPress)
  if (asciiInstance) {
    asciiInstance.dispose()
  }
})
</script>

<template>
  <section class="hero-ascii">
    <div ref="containerRef" class="ascii-text-container"></div>

    <div v-if="showControls" class="dev-controls">
      <h3>Dev Controls</h3>

      <div class="control-group">
        <label>ASCII Font Size:</label>
        <input type="number" v-model.number="asciiFontSize" step="1" @input="recreateAscii">
      </div>

      <div class="control-group">
        <label>Text Font Size:</label>
        <input type="number" v-model.number="textFontSize" step="1" @input="recreateAscii">
      </div>

      <div class="control-group">
        <label>Base Height:</label>
        <input type="number" v-model.number="planeBaseHeight" step="0.1" @input="recreateAscii">
      </div>

      <button @click="copyValues" class="copy-btn">Copy Values</button>
      <button @click="showControls = false" class="close-btn">Close</button>
    </div>
  </section>
</template>

<style scoped>
.hero-ascii {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.ascii-text-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.ascii-text-container :deep(canvas) {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  image-rendering: optimizeSpeed;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: optimize-contrast;
  image-rendering: crisp-edges;
  image-rendering: pixelated;
}

.ascii-text-container :deep(pre) {
  margin: 0;
  user-select: none;
  padding: 0;
  position: absolute;
  white-space: pre;
  overflow: hidden;
  background-image: radial-gradient(circle, #ff6188 0%, #fc9867 50%, #ffd866 100%);
  background-attachment: fixed;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  z-index: 9;
  font-variant-ligatures: none;
  font-feature-settings: 'liga' 0;
}

.dev-controls {
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 20px;
  max-width: 300px;
  z-index: 1000;
  font-family: var(--font-mono);
  font-size: 12px;
}

.dev-controls h3 {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: var(--color-text-primary);
}

.control-group {
  margin-bottom: 15px;
}

.control-group label {
  display: block;
  margin-bottom: 5px;
  color: var(--color-text-secondary);
  font-size: 11px;
}

.control-group input[type="number"] {
  width: 100%;
  padding: 4px 8px;
  background: var(--color-background);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 11px;
}

.copy-btn,
.close-btn {
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 11px;
}

.copy-btn:hover,
.close-btn:hover {
  background: var(--color-primary-hover);
}

.close-btn {
  background: var(--color-error);
  margin-top: 5px;
}
</style>
