<script setup lang="ts">
import * as THREE from 'three'

const props = defineProps<{
  text: string
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let letters: Array<{
  mesh: THREE.Mesh
  velocity: THREE.Vector3
  rotation: THREE.Vector3
}> = []
let animationId: number

const createLetterGeometry = (char: string) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  canvas.width = 128
  canvas.height = 128

  context.fillStyle = 'white'
  context.font = 'bold 100px monospace'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(char, 64, 64)

  const texture = new THREE.CanvasTexture(canvas)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide
  })

  const geometry = new THREE.PlaneGeometry(2, 2)
  return new THREE.Mesh(geometry, material)
}

const init = () => {
  if (!canvasRef.value) return

  // Scene
  scene = new THREE.Scene()

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.z = 15

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  // Create letters
  const text = props.text
  const letterSpacing = 2.2
  const startX = -(text.length * letterSpacing) / 2

  letters = []
  text.split('').forEach((char, i) => {
    const mesh = createLetterGeometry(char)
    mesh.position.x = startX + i * letterSpacing
    mesh.position.y = 0
    mesh.position.z = 0

    scene.add(mesh)

    letters.push({
      mesh,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        0,
        (Math.random() - 0.5) * 0.02
      ),
      rotation: new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05
      )
    })
  })

  animate()
}

const animate = () => {
  animationId = requestAnimationFrame(animate)

  // Physics
  letters.forEach(({ mesh, velocity, rotation }) => {
    // Gravity
    velocity.y -= 0.003

    // Update position
    mesh.position.add(velocity)

    // Rotation
    mesh.rotation.x += rotation.x
    mesh.rotation.y += rotation.y
    mesh.rotation.z += rotation.z

    // Bounce off bottom
    if (mesh.position.y < -10) {
      velocity.y *= -0.5
      mesh.position.y = -10
    }
  })

  renderer.render(scene, camera)
}

const handleResize = () => {
  if (!canvasRef.value) return

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

onMounted(() => {
  init()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
  letters.forEach(({ mesh }) => {
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
  <canvas ref="canvasRef" class="physics-canvas" />
</template>

<style scoped>
.physics-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 10;
}
</style>
