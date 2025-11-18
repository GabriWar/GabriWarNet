<script setup lang="ts">
const handleClick = (...cssClasses: string[]) => {
  cssClasses.forEach((cssClass) => {
    const element = document.querySelector(`.${cssClass}`)
    if (!element) return

    const visible = element.getAttribute('data-visible')
    if (visible === '0') {
      element.setAttribute('data-visible', '1')
    } else if (visible === '1') {
      element.setAttribute('data-visible', '0')
      setTimeout(() => {
        (element as HTMLElement).style.display = 'block'
      }, 5000)
    }
  })
}
</script>

<template>
  <div class="resume-container">
    <div class="resume-section" data-visible="1">
      <a
        class="txtanim link-color"
        @click="handleClick('resumetxt')"
      >
        Resume
      </a>
      <p class="resumetxt" data-visible="0">
        Hello, I'm Gabriel, a passionate Full Stack Developer currently
        studying Computer Science. With a deep-rooted love for Linux, I
        consider myself a power user, I love libre and open-source software.
        My curiosity extends beyond coding, I'm also proficient in image
        manipulation, And my love for debugging apps and modding Android
        phones adds to my technical skills.
      </p>
    </div>

    <div class="resume-section" data-visible="1">
      <a
        class="txtanim link-color-web"
        @click="handleClick('resumeWebDev')"
      >
        WebDev
      </a>
      <p class="resumeWebDev" data-visible="0">
        Proficient in both front-end and back-end technologies, experienced
        with HTML, CSS, JavaScript (<NuxtLink class="txtanim link-color-react" to="/links/3">React/Next</NuxtLink>,
        <NuxtLink class="txtanim link-color-vue" to="/links/3">Vue/Nuxt</NuxtLink>,
        <NuxtLink class="txtanim link-color-rust" to="/links/5">Svelte/SvelteKit</NuxtLink>), and server-side scripting languages (<NuxtLink class="txtanim link-color-projects" to="/links/2">Node.js</NuxtLink>,
        <NuxtLink class="txtanim link-color-cpp" to="/links/4">C++</NuxtLink>,
        <NuxtLink class="txtanim link-color-rust" to="/links/5">Rust</NuxtLink>,
        <NuxtLink class="txtanim link-color-py" to="/links/6">Python</NuxtLink>).
      </p>
    </div>

    <div class="resume-section" data-visible="1">
      <a
        class="txtanim link-color-linux"
        @click="handleClick('resumelinux')"
      >
        Linux
      </a>
      <p class="resumelinux" data-visible="0">
        Proficient with the
        <NuxtLink class="txtanim link-color-linux" to="/links/7">Linux</NuxtLink>
        command line operation, comfortable with
        <NuxtLink class="txtanim link-color" to="/links/7">Shell Scripting</NuxtLink> and automation,
        adept at optimizing system performance and troubleshooting.
      </p>
    </div>

    <div class="resume-section" data-visible="1">
      <a
        class="txtanim link-color-edu"
        @click="handleClick('resumeedu')"
      >
        Education
      </a>
      <p class="resumeedu" data-visible="0">
        Currently pursuing a degree in Computer Science, I am dedicated to
        expanding my knowledge and staying at the forefront of technology. I
        also speak Portuguese (native), English (fluent), German (learning).
      </p>
    </div>

    <div class="resume-section" data-visible="1">
      <a
        class="txtanim link-color-projects"
        @click="handleClick('resumeproj')"
      >
        Projects
      </a>
      <p class="resumeproj" data-visible="0">
        <NuxtLink class="txtanim link-color-projects" to="/links/1">GitHub</NuxtLink>
        <NuxtLink class="txtanim link-color-js" to="/links/2">JavaScript</NuxtLink>
        <NuxtLink class="txtanim link-color-py" to="/links/6">Python</NuxtLink>
        <NuxtLink class="txtanim link-color-cpp" to="/links/4">C++</NuxtLink>
        <NuxtLink class="txtanim link-color-rust" to="/links/5">Rust</NuxtLink>
        <NuxtLink class="txtanim link-color-react" to="/links/3">React</NuxtLink>
        <NuxtLink class="txtanim link-color-vue" to="/links/3">Vue</NuxtLink>
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
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.5s ease-out, opacity 0.4s ease-out, margin-top 0.4s ease-out;
}

.resume-section > p[data-visible="1"] {
  max-height: 500px;
  opacity: 1;
  margin-top: var(--spacing-sm);
}

.resume-section > p[data-visible="0"] {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
}

.resumeproj a {
  margin-right: var(--spacing-sm);
}
</style>
