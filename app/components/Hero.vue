<script setup lang="ts">
// Randomly choose between all three hero variants
// Use onMounted to avoid hydration mismatch
const heroVariant = ref(0)

onMounted(() => {
  heroVariant.value = Math.floor(Math.random() * 3)
})
</script>

<template>
  <ClientOnly>
    <HeroPhysics v-if="heroVariant === 0" />
    <HeroScramble v-else-if="heroVariant === 1" />
    <HeroASCII v-else />
    <template #fallback>
      <div style="min-height: 100vh" />
    </template>
  </ClientOnly>
</template>
