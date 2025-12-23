<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const switchLanguage = () => {
  const newLocale = locale.value === 'en' ? 'pt-BR' : 'en'
  setLocale(newLocale)
}

const currentLanguageLabel = computed(() => {
  return locale.value === 'en' ? 'EN' : 'PT'
})
</script>

<template>
  <button 
    class="language-switcher" 
    @click="switchLanguage"
    :aria-label="`Switch to ${locale === 'en' ? 'Portuguese' : 'English'}`"
  >
    <span class="language-label">{{ currentLanguageLabel }}</span>
  </button>
</template>

<style scoped>
.language-switcher {
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--color-background);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 100;
  box-shadow: var(--shadow-md);
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 600;
}

.language-switcher:hover {
  background: var(--color-text-primary);
  color: var(--color-background);
  border-color: var(--color-text-primary);
  transform: scale(1.1);
  box-shadow: var(--shadow-lg);
}

.language-label {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .language-switcher {
    top: 1.5rem;
    right: 1.5rem;
  }
}
</style>
