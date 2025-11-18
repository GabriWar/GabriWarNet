<script setup lang="ts">
const { scramble } = useTextScramble()
const titleRef = ref<HTMLElement | null>(null)

const texts = ['GabriWar', 'GABRIEL!', '_GUERRA_']
const currentIndex = ref(0)

const handleMouseOver = () => {
  if (titleRef.value) {
    currentIndex.value = (currentIndex.value + 1) % texts.length
    const nextText = texts[currentIndex.value]

    scramble(titleRef.value, nextText, {
      speed: 30,
      iterations: 3,
      chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_!'
    })
  }
}

onMounted(() => {
  if (titleRef.value) {
    scramble(titleRef.value, texts[0], {
      speed: 30,
      iterations: 3,
      chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_!'
    })
  }
})
</script>

<template>
  <section class="hero">
    <h1
      ref="titleRef"
      class="hero-title"
      @mouseover="handleMouseOver"
    >
      GabriWar
    </h1>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-title {
  font-family: var(--font-mono);
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.1;
  letter-spacing: 0.05em;
  cursor: pointer;
  user-select: none;
}
</style>
