<script setup lang="ts">
// Randomly choose between all three hero variants
const heroVariant = ref(Math.floor(Math.random() * 3))
</script>

<template>
  <HeroPhysics v-if="heroVariant === 0" />
  <HeroScramble v-else-if="heroVariant === 1" />
  <HeroASCII v-else />
</template>
