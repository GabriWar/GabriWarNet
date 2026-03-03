const EMPTY = 32
const GRAVITY = 0.8
const FRICTION = 0.3
const RANDOMIZE = 0.03
const FREEZE_MS = 2000
const RAIN_CHANCE = 0.05

const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}[]()<>+-*/=.,;:_$#@!?'

function randomChar(): number {
  return CHARS.charCodeAt(Math.floor(Math.random() * CHARS.length))
}

export function useAsciiEngine() {
  const preRef = ref<HTMLPreElement | null>(null)

  let w = 0
  let h = 0
  let charW = 0
  let charH = 14
  let grid: Uint8Array[]
  let frozen: Float64Array

  const running = ref(true)
  const raining = ref(true)

  let rafId = 0
  let lastFrame = 0
  let rainInterval = 0

  function measureCharWidth(): number {
    if (!preRef.value) return 8.4
    // Measure actual monospace character width
    const span = document.createElement('span')
    span.style.font = '14px "Courier New", Courier, monospace'
    span.style.position = 'absolute'
    span.style.visibility = 'hidden'
    span.style.whiteSpace = 'pre'
    span.textContent = 'MMMMMMMMMM'
    document.body.appendChild(span)
    const measured = span.offsetWidth / 10
    document.body.removeChild(span)
    return measured || 8.4
  }

  function resize() {
    if (!preRef.value) return

    const el = preRef.value
    const rect = el.getBoundingClientRect()
    charW = measureCharWidth()
    charH = 14

    const newW = Math.max(10, Math.floor(rect.width / charW))
    const newH = Math.max(5, Math.floor(rect.height / charH))

    if (Math.abs(newW - w) <= 3 && Math.abs(newH - h) <= 3) return

    const oldGrid = grid
    const oldW = w
    const oldH = h

    w = newW
    h = newH
    grid = []
    for (let y = 0; y < h; y++) {
      grid.push(new Uint8Array(w).fill(EMPTY))
    }
    frozen = new Float64Array(w * h)

    if (oldGrid) {
      const copyW = Math.min(oldW, w)
      const copyH = Math.min(oldH, h)
      for (let y = 0; y < copyH; y++) {
        for (let x = 0; x < copyW; x++) {
          grid[y]![x] = oldGrid[y]![x]!
        }
      }
    }
  }

  function reset() {
    for (let y = 0; y < h; y++) {
      grid[y]!.fill(EMPTY)
    }
    frozen.fill(0)
  }

  function isFrozen(x: number, y: number): boolean {
    const t = frozen[y * w + x]!
    if (t === 0) return false
    if (Date.now() >= t) {
      frozen[y * w + x] = 0
      return false
    }
    return true
  }

  function placeChar(gx: number, gy: number, charCode?: number) {
    if (gx < 0 || gx >= w || gy < 0 || gy >= h) return
    grid[gy]![gx] = charCode ?? randomChar()
  }

  function addCharsAt(gx: number, gy: number, radius: number) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy > radius * radius) continue
        const ex = gx + dx
        const ey = gy + dy
        if (ex >= 0 && ex < w && ey >= 0 && ey < h) {
          grid[ey]![ex] = randomChar()
        }
      }
    }
  }

  function eraseArea(gx: number, gy: number, radius: number) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy > radius * radius) continue
        const ex = gx + dx
        const ey = gy + dy
        if (ex >= 0 && ex < w && ey >= 0 && ey < h) {
          grid[ey]![ex] = EMPTY
          frozen[ey * w + ex] = 0
        }
      }
    }
  }

  function pixelToGrid(px: number, py: number): [number, number] {
    if (!preRef.value) return [0, 0]
    const rect = preRef.value.getBoundingClientRect()
    return [
      Math.max(0, Math.min(w - 1, Math.floor((px - rect.left) / charW))),
      Math.max(0, Math.min(h - 1, Math.floor((py - rect.top) / charH))),
    ]
  }

  function tick() {
    // Process bottom-up — simple cellular automata
    for (let y = h - 2; y >= 0; y--) {
      const row = grid[y]!
      const below = grid[y + 1]!
      for (let x = 0; x < w; x++) {
        if (row[x] === EMPTY) continue
        if (isFrozen(x, y)) continue

        // Randomization: slight sideways drift to prevent vertical towers
        if (Math.random() < RANDOMIZE) {
          const dir = Math.random() < 0.5 ? -1 : 1
          const nx = x + dir
          if (nx >= 0 && nx < w && row[nx] === EMPTY) {
            row[nx] = row[x]!
            row[x] = EMPTY
            continue
          }
        }

        // Gravity: fall down if space below
        if (below[x] === EMPTY) {
          if (Math.random() < GRAVITY) {
            below[x] = row[x]!
            row[x] = EMPTY
          }
          continue
        }

        // Friction/sliding: blocked below, try diagonal
        if (Math.random() < FRICTION) {
          const dir = Math.random() < 0.5 ? -1 : 1
          const nx = x + dir
          if (nx >= 0 && nx < w && below[nx] === EMPTY && row[nx] === EMPTY) {
            below[nx] = row[x]!
            row[x] = EMPTY
          }
        }
      }
    }
  }

  function render() {
    if (!preRef.value || w === 0) return

    const lines = new Array<string>(h)
    for (let y = 0; y < h; y++) {
      lines[y] = String.fromCharCode.apply(null, grid[y]! as unknown as number[])
    }
    preRef.value.textContent = lines.join('\n')
  }

  function loop(timestamp: number) {
    rafId = requestAnimationFrame(loop)

    if (!running.value) return

    // Throttle to ~120fps
    if (timestamp - lastFrame < 8) return
    lastFrame = timestamp

    tick()
    render()
  }

  function rain() {
    if (!raining.value || !running.value) return
    const topRow = grid[0]
    if (!topRow) return
    for (let x = 0; x < w; x++) {
      if (topRow[x] === EMPTY && Math.random() < RAIN_CHANCE) {
        topRow[x] = randomChar()
      }
    }
  }

  function addText(text: string, x: number, y: number, freeze: boolean) {
    for (let i = 0; i < text.length; i++) {
      const gx = x + i
      if (gx >= 0 && gx < w && y >= 0 && y < h) {
        grid[y]![gx] = text.charCodeAt(i)
        if (freeze) {
          frozen[y * w + gx] = Date.now() + FREEZE_MS
        }
      }
    }
  }

  function start() { running.value = true }
  function stop() { running.value = false }
  function toggleRain() { raining.value = !raining.value }

  function init() {
    w = 0
    h = 0
    grid = []
    frozen = new Float64Array(0)
    resize()

    // Place initial text
    const tag = '@GabriWar'
    const tagX = Math.floor(Math.random() * Math.max(1, w - tag.length))
    addText(tag, tagX, 0, true)

    lastFrame = 0
    rafId = requestAnimationFrame(loop)
    rainInterval = window.setInterval(rain, 100)
  }

  function destroy() {
    cancelAnimationFrame(rafId)
    clearInterval(rainInterval)
  }

  return {
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
    placeChar,
    addCharsAt,
    eraseArea,
    pixelToGrid,
    addText,
  }
}
