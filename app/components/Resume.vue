<script setup lang="ts">
import { reactive } from 'vue'
import DecryptedText from './DecryptedText.vue'

const visibility = reactive({
  resume: false,
  webdev: false,
  linux: false,
  education: false,
  projects: false,
  skills: false,
  competencies: false,
  interests: false
})

const toggle = (section: keyof typeof visibility) => {
  const wasOpen = visibility[section]
  // Close all sections first
  Object.keys(visibility).forEach(key => {
    visibility[key as keyof typeof visibility] = false
  })
  // Toggle the clicked section (close if it was already open)
  visibility[section] = !wasOpen
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

    <div class="resume-section" data-visible="1">
      <a
        class="txtanim link-color"
        @click="toggle('skills')"
      >
        {{ $t('resume.skills.title') }}
      </a>
      <p v-if="visibility.skills" class="resumeskills">
        <DecryptedText :text="$t('resume.skills.intro')" v-bind="animProps" />
        <NuxtLink class="txtanim link-color-py" to="/links/6"><DecryptedText text="Python" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=", " v-bind="animProps" />
        <NuxtLink class="txtanim link-color-js" to="/links/2"><DecryptedText text="JavaScript/TypeScript" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=", " v-bind="animProps" />
        <NuxtLink class="txtanim link-color-rust" to="/links/5"><DecryptedText text="Rust" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=", " v-bind="animProps" />
        <NuxtLink class="txtanim link-color-rust" to="/links/5"><DecryptedText text="Go" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=", " v-bind="animProps" />
        <NuxtLink class="txtanim link-color-cpp" to="/links/4"><DecryptedText text="C/C++" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=", C#, Java, PHP, Assembly, Bash" v-bind="animProps" />
        <DecryptedText :text="$t('resume.skills.frontend')" v-bind="animProps" />
        <NuxtLink class="txtanim link-color-react" to="/links/3"><DecryptedText text="React" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=", " v-bind="animProps" />
        <NuxtLink class="txtanim link-color-react" to="/links/3"><DecryptedText text="Angular" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=", " v-bind="animProps" />
        <NuxtLink class="txtanim link-color-vue" to="/links/3"><DecryptedText text="Vue" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=", Modern JavaScript frameworks, Component libraries, Responsive design" v-bind="animProps" />
        <DecryptedText :text="$t('resume.skills.backend')" v-bind="animProps" />
        <NuxtLink class="txtanim link-color-projects" to="/links/2"><DecryptedText text="Node.js" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=", SQL (MySQL, Postgres, MSSQL) & NoSQL, Bun, REST APIs" v-bind="animProps" />
        <DecryptedText :text="$t('resume.skills.cloud')" v-bind="animProps" />
        <DecryptedText text="Google Cloud Platform, Docker, Nginx, Container orchestration, Minio" v-bind="animProps" />
        <DecryptedText :text="$t('resume.skills.iot')" v-bind="animProps" />
        <DecryptedText text="Modbus TCP/IP, Industrial automation protocols, PLC programming, Real-time telemetry systems" v-bind="animProps" />
        <DecryptedText :text="$t('resume.skills.ai')" v-bind="animProps" />
        <DecryptedText text="Large Language Models, RAG architecture, Model deployment, Computer vision" v-bind="animProps" />
        <DecryptedText :text="$t('resume.skills.realtime')" v-bind="animProps" />
        <DecryptedText text="WebSockets, Real-time data synchronization, Messaging platforms integration" v-bind="animProps" />
        <DecryptedText :text="$t('resume.skills.devops')" v-bind="animProps" />
        <DecryptedText text="Git, " v-bind="animProps" />
        <NuxtLink class="txtanim link-color-linux" to="/links/7"><DecryptedText text="Linux" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=" (Arch, Debian, Ubuntu, Kali), System automation, CI/CD" v-bind="animProps" />
        <DecryptedText :text="$t('resume.skills.specialized')" v-bind="animProps" />
        <DecryptedText text="Enterprise platform architecture, Digital signatures integration, Document generation, Visual workflow builders" v-bind="animProps" />
        <DecryptedText :text="$t('resume.skills.langs')" v-bind="animProps" />
        <DecryptedText text="Portuguese (Native), English (Fluent), Spanish (Proficient), Italian (Basic), Russian (Learning)" v-bind="animProps" />
      </p>
    </div>

    <div class="resume-section" data-visible="1">
      <a
        class="txtanim link-color-web"
        @click="toggle('competencies')"
      >
        {{ $t('resume.competencies.title') }}
      </a>
      <p v-if="visibility.competencies" class="resumecompetencies">
        <DecryptedText
          :text="$t('resume.competencies.description')"
          v-bind="animProps"
        />
      </p>
    </div>

    <div class="resume-section" data-visible="1">
      <a
        class="txtanim link-color-rust"
        @click="toggle('interests')"
      >
        {{ $t('resume.interests.title') }}
      </a>
      <p v-if="visibility.interests" class="resumeinterests">
        <DecryptedText :text="$t('resume.interests.intro')" v-bind="animProps" />
        <NuxtLink class="txtanim link-color-cpp" to="/links/4"><DecryptedText text="C++" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=", " v-bind="animProps" />
        <NuxtLink class="txtanim link-color-py" to="/links/6"><DecryptedText text="Python" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=", " v-bind="animProps" />
        <NuxtLink class="txtanim link-color-rust" to="/links/5"><DecryptedText text="Rust" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=", " v-bind="animProps" />
        <NuxtLink class="txtanim link-color-rust" to="/links/5"><DecryptedText text="Go" v-bind="animProps" /></NuxtLink>
        <DecryptedText text=", and " v-bind="animProps" />
        <NuxtLink class="txtanim link-color-js" to="/links/2"><DecryptedText text="JavaScript" v-bind="animProps" /></NuxtLink>
        <DecryptedText :text="$t('resume.interests.android')" v-bind="animProps" />
        <NuxtLink class="txtanim link-color-linux" to="/links/7"><DecryptedText text="Linux" v-bind="animProps" /></NuxtLink>
        <DecryptedText :text="$t('resume.interests.music')" v-bind="animProps" />
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

/* Show scrollbar on mobile */
@media (max-width: 768px) {
  .resume-container {
    scrollbar-width: thin;
    scrollbar-color: var(--color-text-secondary) transparent;
  }
  
  .resume-container::-webkit-scrollbar {
    display: block;
    width: 6px;
  }
  
  .resume-container::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .resume-container::-webkit-scrollbar-thumb {
    background: var(--color-text-secondary);
    border-radius: 3px;
  }
}

@media (max-width: 768px) {
  .resume-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-width: 100%;
    height: 100vh;
    padding: 4rem var(--spacing-md) 5rem;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    pointer-events: auto;
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

@media (max-width: 768px) {
  .resume-section > a {
    font-size: 1.5rem;
    padding: var(--spacing-xs) 0;
    margin-bottom: var(--spacing-md);
  }
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

@media (max-width: 768px) {
  .scroll-indicator {
    display: none;
  }
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
