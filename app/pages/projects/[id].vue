<script setup lang="ts">
const route = useRoute()
const projectId = route.params.id
</script>

<template>
  <div class="project-page">
    <div class="content">
      <h1>Project: {{ projectId }}</h1>
      <p>Details coming soon...</p>
      <NuxtLink to="/" class="back-link">← Back to Home</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.project-page {
  padding: var(--spacing-2xl);
  padding-top: 120px;
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-text-primary);
  position: relative;
  z-index: 20;
}

.content {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-family: var(--font-display);
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
  text-transform: uppercase;
}

.back-link {
  display: inline-block;
  margin-top: var(--spacing-xl);
  color: var(--color-primary);
  text-decoration: none;
  font-family: var(--font-mono);
}

.back-link:hover {
  text-decoration: underline;
}
</style>
