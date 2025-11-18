<script setup lang="ts">
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const texts = ['GabriWar', 'GABRIEL!', '_GUERRA_']
const currentIndex = ref(0)

// Dev controls
const fontSize = ref(6)
const fontDepth = ref(1)
const letterSpacing = ref(0.55)
const cameraX = ref(0)
const cameraY = ref(0)
const cameraZ = ref(150)
const groundY = ref(30)
const showControls = ref(false)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let world: CANNON.World
let textMeshes: THREE.Mesh[] = []
let textBodies: CANNON.Body[] = []
let animationId: number
let font: any
let hasDropped = false
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
let draggedBody: CANNON.Body | null = null
let draggedMesh: THREE.Mesh | null = null
let dragOffset = new THREE.Vector3()
let targetDragPosition = new THREE.Vector3()

const init = async () => {
  if (!canvasRef.value) return

  // Scene
  scene = new THREE.Scene()

  // Camera
  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    1500
  )
  camera.position.set(cameraX.value, cameraY.value, cameraZ.value)
  camera.lookAt(0, 0, 0)

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  // Physics world
  world = new CANNON.World()
  world.gravity.set(0, -200, 0)

  // Ground
  const groundBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane()
  })
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
  groundBody.position.set(0, -groundY.value, 0)
  world.addBody(groundBody)

  // Load font
  const loader = new FontLoader()
  font = await new Promise((resolve) => {
    loader.load('/fonts/droid_sans_mono_regular.typeface.json', resolve)
  })

  createText(texts[0])
  animate()
}

const createText = (text: string) => {
  // Clear existing
  textMeshes.forEach(mesh => {
    scene.remove(mesh)
    mesh.geometry.dispose()
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach(m => m.dispose())
    } else {
      mesh.material.dispose()
    }
  })
  textBodies.forEach(body => world.removeBody(body))
  textMeshes = []
  textBodies = []

  const textColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-text-primary') || '#ffffff'

  const material = new THREE.MeshBasicMaterial({ color: textColor })

  // Calculate total width for centering
  let totalWidth = 0
  const letterGeometries: TextGeometry[] = []

  text.split('').forEach((char) => {
    const geo = new TextGeometry(char, {
      font: font,
      size: fontSize.value,
      depth: fontDepth.value,
      curveSegments: 4,
      bevelEnabled: false
    })
    geo.computeBoundingBox()
    letterGeometries.push(geo)
    totalWidth += (geo.boundingBox!.max.x - geo.boundingBox!.min.x) + letterSpacing.value
  })

  const startX = -totalWidth / 2
  let currentX = startX

  letterGeometries.forEach((geo, i) => {
    const mesh = new THREE.Mesh(geo, material)
    const width = geo.boundingBox!.max.x - geo.boundingBox!.min.x
    const height = geo.boundingBox!.max.y - geo.boundingBox!.min.y
    const depth = geo.boundingBox!.max.z - geo.boundingBox!.min.z

    mesh.position.x = currentX
    mesh.position.y = 0
    mesh.position.z = 0
    scene.add(mesh)
    textMeshes.push(mesh)

    // Physics body for each letter
    const letterBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2)),
      position: new CANNON.Vec3(currentX + width / 2, height / 2, depth / 2),
      quaternion: new CANNON.Quaternion(0, 0, 0, 1), // Start with no rotation
      type: CANNON.Body.KINEMATIC // Start as kinematic (not affected by physics)
    })
    letterBody.velocity.set(0, 0, 0)
    letterBody.angularVelocity.set(0, 0, 0)
    world.addBody(letterBody)
    textBodies.push(letterBody)

    currentX += width + letterSpacing.value
  })
}

const dropText = () => {
  textBodies.forEach((body, index) => {
    setTimeout(() => {
      // Reset to current position before enabling physics
      const currentPos = body.position.clone()
      body.type = CANNON.Body.DYNAMIC // Enable physics
      body.position.copy(currentPos)
      body.quaternion.set(0, 0, 0, 1) // Reset rotation

      // NOW apply random forces
      body.velocity.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5
      )
      body.angularVelocity.set(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      )

      // Add damping so they stop eventually
      body.linearDamping = 0.5
      body.angularDamping = 0.5
    }, index * 50)
  })
}

const animate = () => {
  animationId = requestAnimationFrame(animate)

  world.step(1 / 60)

  // Apply drag force if dragging
  if (draggedBody && draggedMesh) {
    const currentPos = new THREE.Vector3(
      draggedBody.position.x,
      draggedBody.position.y,
      draggedBody.position.z
    )

    // Calculate direction and distance to target
    const direction = new THREE.Vector3()
      .copy(targetDragPosition)
      .sub(currentPos)

    // Apply force proportional to distance (spring-like)
    const forceMagnitude = 100 // Stronger force for less floaty feel
    draggedBody.force.set(
      direction.x * forceMagnitude,
      direction.y * forceMagnitude,
      0
    )
  }

  // Update mesh positions from physics
  textMeshes.forEach((mesh, i) => {
    const body = textBodies[i]
    if (body.type === CANNON.Body.DYNAMIC) {
      mesh.position.copy(body.position as any)
      mesh.quaternion.copy(body.quaternion as any)
    }
  })

  renderer.render(scene, camera)
}

const handleResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const updateCamera = () => {
  if (camera) {
    camera.position.set(cameraX.value, cameraY.value, cameraZ.value)
    camera.lookAt(0, 0, 0)
  }
}

const recreateText = () => {
  hasDropped = false

  // Update ground position
  if (world) {
    world.bodies.forEach(body => {
      if (body.mass === 0) { // Ground body
        body.position.set(0, -groundY.value, 0)
      }
    })
  }

  createText(texts[currentIndex.value])
}

const copyValues = () => {
  const values = `
fontSize: ${fontSize.value}
fontDepth: ${fontDepth.value}
letterSpacing: ${letterSpacing.value}
cameraX: ${cameraX.value}
cameraY: ${cameraY.value}
cameraZ: ${cameraZ.value}
groundY: ${groundY.value}
  `.trim()
  navigator.clipboard.writeText(values)
  alert('Values copied to clipboard!')
}

const handleMouseMove = (event: MouseEvent) => {
  if (hasDropped || textMeshes.length === 0) return

  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  // Update the raycaster
  raycaster.setFromCamera(mouse, camera)

  // Check for intersections
  const intersects = raycaster.intersectObjects(textMeshes)

  if (intersects.length > 0) {
    hasDropped = true
    dropText()
  }
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === "'") {
    showControls.value = !showControls.value
  }
}

const handleMouseDown = (event: MouseEvent) => {
  if (textMeshes.length === 0) return

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(textMeshes)

  if (intersects.length > 0) {
    const clickedMesh = intersects[0].object as THREE.Mesh
    const meshIndex = textMeshes.indexOf(clickedMesh)

    if (meshIndex !== -1) {
      draggedBody = textBodies[meshIndex]
      draggedMesh = clickedMesh

      // Calculate offset between click point and object center
      dragOffset.copy(intersects[0].point).sub(clickedMesh.position)

      // Keep it dynamic for physics-based dragging
      draggedBody.type = CANNON.Body.DYNAMIC
      draggedBody.linearDamping = 0.95 // Higher damping for tighter following
      draggedBody.angularDamping = 0.95
    }
  }
}

const handleMouseMoveForDrag = (event: MouseEvent) => {
  if (!draggedBody || !draggedMesh) return

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  // Create a plane at the letter's Z position
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -draggedMesh.position.z)
  const intersectionPoint = new THREE.Vector3()
  raycaster.ray.intersectPlane(plane, intersectionPoint)

  if (intersectionPoint) {
    // Apply the offset so it doesn't snap to center
    intersectionPoint.sub(dragOffset)
    targetDragPosition.copy(intersectionPoint)
  }
}

const handleMouseUp = () => {
  if (draggedBody) {
    draggedBody.force.set(0, 0, 0)
    draggedBody.linearDamping = 0.5
    draggedBody.angularDamping = 0.5
  }
  draggedBody = null
  draggedMesh = null
}

onMounted(() => {
  init()
  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mousemove', handleMouseMoveForDrag)
  window.addEventListener('mousedown', handleMouseDown)
  window.addEventListener('mouseup', handleMouseUp)
  window.addEventListener('keypress', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mousemove', handleMouseMoveForDrag)
  window.removeEventListener('mousedown', handleMouseDown)
  window.removeEventListener('mouseup', handleMouseUp)
  window.removeEventListener('keypress', handleKeyPress)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
  textMeshes.forEach(mesh => {
    scene.remove(mesh)
    mesh.geometry.dispose()
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach(m => m.dispose())
    } else {
      mesh.material.dispose()
    }
  })
})
</script>

<template>
  <section class="hero">
    <canvas ref="canvasRef" class="physics-canvas" />

    <div v-if="showControls" class="dev-controls">
      <h3>Dev Controls</h3>

      <div class="control-group">
        <label>Font Size:</label>
        <input type="number" v-model.number="fontSize" step="0.01" @input="recreateText">
      </div>

      <div class="control-group">
        <label>Font Depth:</label>
        <input type="number" v-model.number="fontDepth" step="0.01" @input="recreateText">
      </div>

      <div class="control-group">
        <label>Letter Spacing:</label>
        <input type="number" v-model.number="letterSpacing" step="0.01" @input="recreateText">
      </div>

      <div class="control-group">
        <label>Camera X:</label>
        <input type="number" v-model.number="cameraX" step="0.1" @input="updateCamera">
      </div>

      <div class="control-group">
        <label>Camera Y:</label>
        <input type="number" v-model.number="cameraY" step="0.1" @input="updateCamera">
      </div>

      <div class="control-group">
        <label>Camera Z:</label>
        <input type="number" v-model.number="cameraZ" step="0.1" @input="updateCamera">
      </div>

      <div class="control-group">
        <label>Ground Y:</label>
        <input type="number" v-model.number="groundY" step="0.5" @input="recreateText">
      </div>

      <button @click="copyValues" class="copy-btn">Copy Values</button>
      <button @click="showControls = false" class="close-btn">Close</button>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.physics-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  cursor: pointer;
  pointer-events: all;
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
