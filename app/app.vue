<script setup lang="ts">
import ClickSpark from '~/components/Animations/ClickSpark.vue'
import PixelSnow from '~/components/PixelSnow.vue'
import Resume from '~/components/Resume.vue' // New import

const { initTheme, theme } = useTheme()

const sparkColor = computed(() => {
  return theme.value === 'dark' ? '#ffffff' : '#000000'
})

const isDecember = computed(() => {
  const currentDate = new Date()
  return currentDate.getMonth() === 11 // Month 11 is December (0-indexed)
})

const snowColor = computed(() => {
  return theme.value === 'dark' ? '#ffffff' : '#000000'
})

onMounted(() => {
  initTheme()
})
</script>

<template>
  <VueLenis root>
    <ClickSpark
      :spark-color="sparkColor"
      :spark-size="12"
      :spark-radius="25"
      :spark-count="12"
      :duration="600"
      easing="ease-out"
      :extra-scale="1.2"
    >
      <div class="app-content-wrapper">
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
        <NuxtRouteAnnouncer />
        <ThemeToggle />
        <LanguageSwitcher />
        <BackToTop />
        <LoadingScreen />
        <Resume />
        <NuxtPage />
      </div>
    </ClickSpark>
  </VueLenis>
</template>

<style scoped>
.app-content-wrapper {
  position: relative;
  z-index: 0;
  width: 100vw;
  min-height: 100vh;
}
.pixel-snow-background {
  z-index: -1;
}
</style>
