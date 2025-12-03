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
        Resume
      </a>
      <p v-if="visibility.resume" class="resumetxt">
        <DecryptedText
          text="Hello, I'm Gabriel, a passionate Full Stack Developer currently studying Computer Science. With a deep-rooted love for Linux, I consider myself a power user, I love libre and open-source software. My curiosity extends beyond coding, I'm also proficient in image manipulation, And my love for debugging apps and modding Android phones adds to my technical skills."
          v-bind="animProps"
        />
      </p>
    </div>

    <div class="resume-section" data-visible="1">
      <a
        class="txtanim link-color-web"
        @click="toggle('webdev')"
      >
        WebDev
      </a>
      <p v-if="visibility.webdev" class="resumeWebDev">
        <DecryptedText text="Proficient in both front-end and back-end technologies, experienced with HTML, CSS, JavaScript (" v-bind="animProps" />
        <NuxtLink class="txtanim link-color-react" to="/links/3"><DecryptedText text="React/Next" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=", " v-bind="animProps" />
        <NuxtLink class="txtanim link-color-vue" to="/links/3"><DecryptedText text="Vue/Nuxt" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=", " v-bind="animProps" />
        <NuxtLink class="txtanim link-color-rust" to="/links/5"><DecryptedText text="Svelte/SvelteKit" v-bind="animProps" /></NuxtLink>
        <DecryptedText text="), and server-side scripting languages (" v-bind="animProps" />
        <NuxtLink class="txtanim link-color-projects" to="/links/2"><DecryptedText text="Node.js" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=", " v-bind="animProps" />
        <NuxtLink class="txtanim link-color-cpp" to="/links/4"><DecryptedText text="C++" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=", " v-bind="animProps" />
        <NuxtLink class="txtanim link-color-rust" to="/links/5"><DecryptedText text="Rust" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=", " v-bind="animProps" />
        <NuxtLink class="txtanim link-color-py" to="/links/6"><DecryptedText text="Python" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=")." v-bind="animProps" />
      </p>
    </div>

    <div class="resume-section" data-visible="1">
      <a
        class="txtanim link-color-linux"
        @click="toggle('linux')"
      >
        Linux
      </a>
      <p v-if="visibility.linux" class="resumelinux">
        <DecryptedText text="Proficient with the " v-bind="animProps" />
        <NuxtLink class="txtanim link-color-linux" to="/links/7"><DecryptedText text="Linux" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=" command line operation, comfortable with " v-bind="animProps" />
        <NuxtLink class="txtanim link-color" to="/links/7"><DecryptedText text="Shell Scripting" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=" and automation, adept at optimizing system performance and troubleshooting." v-bind="animProps" />
      </p>
    </div>

    <div class="resume-section" data-visible="1">
      <a
        class="txtanim link-color-edu"
        @click="toggle('education')"
      >
        Education
      </a>
      <p v-if="visibility.education" class="resumeedu">
        <DecryptedText
          text="Currently pursuing a degree in Computer Science, I am dedicated to expanding my knowledge and staying at the forefront of technology. I also speak Portuguese (native), English (fluent), German (learning)."
          v-bind="animProps"
        />
      </p>
    </div>

    <div class="resume-section" data-visible="1">
      <a
        class="txtanim link-color-projects"
        @click="toggle('projects')"
      >
        Projects
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
  </div>
</template>

<style scoped>
.resume-container {
  position: fixed;
  top: 0;
  left: 2rem;
  width: 100%;
  height: 100vh;
  max-width: 600px;
  padding: var(--spacing-2xl) var(--spacing-md);
  font-family: var(--font-mono);
  overflow-y: auto;
  z-index: 10;
  pointer-events: auto;
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
}

.resume-section > p {
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin-top: var(--spacing-sm);
}

.resumeproj a {
  margin-right: var(--spacing-sm);
}
</style>
