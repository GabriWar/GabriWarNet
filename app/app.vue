<script setup lang="ts">
import ClickSpark from '~/components/Animations/ClickSpark.vue'

const { initTheme, theme } = useTheme()

const sparkColor = computed(() => {
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
        <NuxtRouteAnnouncer />
        <ThemeToggle />
        <NuxtPage />
        <NavBar />
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
</style>
