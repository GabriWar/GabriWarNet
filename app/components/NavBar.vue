<script setup lang="ts">
const route = useRoute()

const links = [
  { to: '/', label: 'Home' },
  { to: '/ascii', label: 'ASCII' },
  { to: '/pattern', label: 'Pattern' },
  { to: '/ai', label: 'AI' },
]

function isActive(path: string): boolean {
  return route.path === path
}
</script>

<template>
  <nav class="navbar">
    <NuxtLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      :class="['navbar-link', { active: isActive(link.to) }]"
    >
      {{ link.label }}
    </NuxtLink>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  padding: 6px 8px;
  background: color-mix(in srgb, var(--color-surface) 70%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  z-index: 50;
}

.navbar-link {
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-decoration: none;
  color: var(--color-text-tertiary);
  padding: 6px 14px;
  border-radius: var(--radius-full);
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.navbar-link:hover {
  color: var(--color-text-primary);
}

.navbar-link.active {
  color: var(--color-text-primary);
  background: color-mix(in srgb, var(--color-border) 60%, transparent);
}
</style>
