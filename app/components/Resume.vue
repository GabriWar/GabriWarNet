<script setup lang="ts">
import { reactive } from 'vue'
import DecryptedText from './DecryptedText.vue'

const visibility = reactive({
  resume: false,
  webdev: false,
  linux: false,
  education: false,
  projects: false
})

const toggle = (section: keyof typeof visibility) => {
  visibility[section] = !visibility[section]
}

const animProps = {
  speed: 1,
  sequential: true,
  useOriginalCharsOnly: false,
  maxIterations: 70,
  animateOn: 'view' as const,
  typewriter: true
}
</script>

<template>
  <div class="resume-container">
    <div class="resume-section" data-visible="1">
      <a
        class="txtanim link-color"
        @click="toggle('resume')"
      >
        {{ $t('resume.title') }}
      </a>
      <p v-if="visibility.resume" class="resumetxt">
        <DecryptedText
          :text="$t('resume.intro')"
          v-bind="animProps"
        />
      </p>
    </div>

    <div class="resume-section" data-visible="1">
      <a
        class="txtanim link-color-web"
        @click="toggle('webdev')"
      >
        {{ $t('resume.webdev.title') }}
      </a>
      <p v-if="visibility.webdev" class="resumeWebDev">
        <DecryptedText :text="$t('resume.webdev.description')" v-bind="animProps" />
        <NuxtLink class="txtanim link-color-react" to="/links/3"><DecryptedText text="React/Next" v-bind="animProps" /></NuxtLink>
        <DecryptedText :text="$t('resume.webdev.and')" v-bind="animProps" />
        <NuxtLink class="txtanim link-color-vue" to="/links/3"><DecryptedText text="Vue/Nuxt" v-bind="animProps" /></NuxtLink>
        <DecryptedText :text="$t('resume.webdev.and')" v-bind="animProps" />
        <NuxtLink class="txtanim link-color-rust" to="/links/5"><DecryptedText text="Svelte/SvelteKit" v-bind="animProps" /></NuxtLink>
        <DecryptedText :text="$t('resume.webdev.serverside')" v-bind="animProps" />
        <NuxtLink class="txtanim link-color-projects" to="/links/2"><DecryptedText text="Node.js" v-bind="animProps" /></NuxtLink>
        <DecryptedText :text="$t('resume.webdev.and')" v-bind="animProps" />
        <NuxtLink class="txtanim link-color-cpp" to="/links/4"><DecryptedText text="C++" v-bind="animProps" /></NuxtLink>
        <DecryptedText :text="$t('resume.webdev.and')" v-bind="animProps" />
        <NuxtLink class="txtanim link-color-rust" to="/links/5"><DecryptedText text="Rust" v-bind="animProps" /></NuxtLink>
        <DecryptedText :text="$t('resume.webdev.and')" v-bind="animProps" />
        <NuxtLink class="txtanim link-color-py" to="/links/6"><DecryptedText text="Python" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=")." v-bind="animProps" />
      </p>
    </div>

    <div class="resume-section" data-visible="1">
      <a
        class="txtanim link-color-linux"
        @click="toggle('linux')"
      >
        {{ $t('resume.linux.title') }}
      </a>
      <p v-if="visibility.linux" class="resumelinux">
        <DecryptedText :text="$t('resume.linux.description')" v-bind="animProps" />
        <NuxtLink class="txtanim link-color-linux" to="/links/7"><DecryptedText text="Linux" v-bind="animProps" /></NuxtLink>
        <DecryptedText :text="$t('resume.linux.comfortable')" v-bind="animProps" />
        <NuxtLink class="txtanim link-color" to="/links/7"><DecryptedText :text="$t('resume.linux.shellscripting')" v-bind="animProps" /></NuxtLink>
        <DecryptedText :text="$t('resume.linux.optimization')" v-bind="animProps" />
      </p>
    </div>

    <div class="resume-section" data-visible="1">
      <a
        class="txtanim link-color-edu"
        @click="toggle('education')"
      >
        {{ $t('resume.education.title') }}
      </a>
      <p v-if="visibility.education" class="resumeedu">
        <DecryptedText
          :text="$t('resume.education.description')"
          v-bind="animProps"
        />
      </p>
    </div>

    <div class="resume-section" data-visible="1">
      <a
        class="txtanim link-color-projects"
        @click="toggle('projects')"
      >
        {{ $t('resume.projects.title') }}
      </a>
      <p v-if="visibility.projects" class="resumeproj">
        <NuxtLink class="txtanim link-color-projects" to="/links/1"><DecryptedText text="GitHub" v-bind="animProps" /></NuxtLink>
        <NuxtLink class="txtanim link-color-js" to="/links/2"><DecryptedText text="JavaScript" v-bind="animProps" /></NuxtLink>
        <NuxtLink class="txtanim link-color-py" to="/links/6"><DecryptedText text="Python" v-bind="animProps" /></NuxtLink>
        <NuxtLink class="txtanim link-color-cpp" to="/links/4"><DecryptedText text="C++" v-bind="animProps" /></NuxtLink>
        <NuxtLink class="txtanim link-color-rust" to="/links/5"><DecryptedText text="Rust" v-bind="animProps" /></NuxtLink>
        <NuxtLink class="txtanim link-color-react" to="/links/3"><DecryptedText text="React" v-bind="animProps" /></NuxtLink>
        <NuxtLink class="txtanim link-color-vue" to="/links/3"><DecryptedText text="Vue" v-bind="animProps" /></NuxtLink>
      </p>
    </div>

    <div class="scroll-indicator">
      <span class="scroll-text">{{ $t('common.scroll') }}</span>
      <div class="arrow-container">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resume-container {
  position: fixed;
  top: 0;
  left: 2rem;
  width: calc(100% - 2rem);
  height: 100vh;
  max-width: 600px;
  padding: var(--spacing-2xl) var(--spacing-md);
  font-family: var(--font-mono);
  overflow-y: auto;
  z-index: 10;
  pointer-events: none;

  /* Hide scrollbar */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.resume-container::-webkit-scrollbar {
  display: none;
}

@media (max-width: 768px) {
  .resume-container {
    left: 0;
    width: 100%;
    padding: 5rem var(--spacing-md) var(--spacing-xl);
  }
}

.resume-section {
  margin-bottom: var(--spacing-lg);
  transition: opacity 0.3s ease;
}

.resume-section[data-visible="0"] {
  opacity: 0;
  pointer-events: none;
}

.resume-section[data-visible="1"] {
  opacity: 1;
}

.resume-section > a {
  display: inline-block;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  cursor: pointer;
  pointer-events: auto;
}

.resume-section > p {
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin-top: var(--spacing-sm);
}

.resumeproj a {
  margin-right: var(--spacing-sm);
  pointer-events: auto;
}

.resume-section a {
  pointer-events: auto;
}

.scroll-indicator {
  margin-top: var(--spacing-2xl);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  opacity: 0.6;
  animation: bounce 2s infinite;
  pointer-events: none;
}

.scroll-text {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.2em;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}
</style>
