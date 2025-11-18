<script setup lang="ts">
const { theme, toggleTheme } = useTheme()
const { t } = useI18n()

const handleClick = (event: MouseEvent) => {
  toggleTheme(event)
}
</script>

<template>
  <button
    @click="handleClick"
    class="theme-toggle"
    :aria-label="t('theme.toggle')"
    :title="t('theme.toggle')"
  >
    <Icon v-if="theme === 'light'" name="ph:moon-fill" />
    <Icon v-else name="ph:sun-fill" />
  </button>
</template>

<style scoped>
.theme-toggle {
  position: fixed;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  z-index: 1000;
}

.theme-toggle:hover {
  background-color: var(--color-primary);
  color: white;
  transform: scale(1.05);
  box-shadow: var(--shadow-lg);
}

.theme-toggle:active {
  transform: scale(0.95);
}
</style>
