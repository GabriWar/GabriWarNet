<script setup lang="ts">
import PixelSnow from '~/components/PixelSnow.vue'
import Resume from '~/components/Resume.vue'

const { theme } = useTheme()

const isDecember = computed(() => new Date().getMonth() === 11)
const snowColor = computed(() => theme.value === 'dark' ? '#ffffff' : '#000000')
</script>

<template>
  <div>
    <PixelSnow
      v-if="isDecember"
      :color="snowColor"
      :flakeSize="0.025"
      :minFlakeSize="1.25"
      :pixelResolution="150"
      :speed="0.75"
      :density="0.5"
      :direction="135"
      :brightness="0.2"
      :depthFade="5"
      :farPlane="12"
      variant="square"
      class="pixel-snow-background"
    />
    <LanguageSwitcher />
    <BackToTop />
    <LoadingScreen />
    <Resume />
    <Hero />
    <Projects />
  </div>
</template>

<style scoped>
.pixel-snow-background {
  z-index: -1;
}
</style>
