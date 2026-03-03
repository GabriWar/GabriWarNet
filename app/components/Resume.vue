<script setup lang="ts">
import { reactive } from 'vue'
import DecryptedText from './DecryptedText.vue'
import PatternBackground from './patterns/PatternBackground.vue'

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

const skillCats = reactive({
  languages: false,
  frontend: false,
  backend: false,
  cloud: false,
  iot: false,
  ai: false,
  realtime: false,
  devops: false,
  specialized: false,
  langs: false,
})

const toggleCat = (cat: keyof typeof skillCats) => {
  const wasOpen = skillCats[cat]
  Object.keys(skillCats).forEach(key => {
    skillCats[key as keyof typeof skillCats] = false
  })
  skillCats[cat] = !wasOpen
}

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
  <PatternBackground />
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
      <div v-if="visibility.skills" class="skill-categories">
        <!-- Programming Languages -->
        <div class="skill-cat">
          <a class="txtanim link-color skill-cat-label" @click="toggleCat('languages')">
            <span class="skill-cat-arrow" :class="{ open: skillCats.languages }">&#9656;</span>
            <DecryptedText :text="$t('resume.skills.languages')" v-bind="animProps" />
          </a>
          <p v-if="skillCats.languages" class="skill-cat-items">
            <a class="txtanim link-color-py" href="https://python.org" target="_blank"><DecryptedText text="Python" v-bind="animProps" /></a><DecryptedText text=", " v-bind="animProps" /><a class="txtanim link-color-js" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank"><DecryptedText text="JavaScript" v-bind="animProps" /></a><DecryptedText text=", " v-bind="animProps" /><a class="txtanim link-color-js" href="https://typescriptlang.org" target="_blank"><DecryptedText text="TypeScript" v-bind="animProps" /></a><DecryptedText text=", " v-bind="animProps" /><a class="txtanim link-color-rust" href="https://rust-lang.org" target="_blank"><DecryptedText text="Rust" v-bind="animProps" /></a><DecryptedText text=", " v-bind="animProps" /><a class="txtanim link-color-react" href="https://go.dev" target="_blank"><DecryptedText text="Go" v-bind="animProps" /></a><DecryptedText text=", " v-bind="animProps" /><a class="txtanim link-color-cpp" href="https://en.cppreference.com/w/c" target="_blank"><DecryptedText text="C" v-bind="animProps" /></a><DecryptedText text="/" v-bind="animProps" /><a class="txtanim link-color-cpp" href="https://isocpp.org" target="_blank"><DecryptedText text="C++" v-bind="animProps" /></a><DecryptedText text=", " v-bind="animProps" /><a class="txtanim link-color-cpp" href="https://dotnet.microsoft.com/languages/csharp" target="_blank"><DecryptedText text="C#" v-bind="animProps" /></a><DecryptedText text=", " v-bind="animProps" /><a class="txtanim link-color-rust" href="https://www.java.com" target="_blank"><DecryptedText text="Java" v-bind="animProps" /></a><DecryptedText text=", " v-bind="animProps" /><a class="txtanim link-color-web" href="https://www.php.net" target="_blank"><DecryptedText text="PHP" v-bind="animProps" /></a><DecryptedText text=", Assembly, " v-bind="animProps" /><a class="txtanim link-color-linux" href="https://www.gnu.org/software/bash/" target="_blank"><DecryptedText text="Bash" v-bind="animProps" /></a><DecryptedText text=", " v-bind="animProps" /><a class="txtanim link-color-edu" href="https://www.lua.org" target="_blank"><DecryptedText text="Lua" v-bind="animProps" /></a>
          </p>
        </div>

        <!-- Frontend -->
        <div class="skill-cat">
          <a class="txtanim link-color-web skill-cat-label" @click="toggleCat('frontend')">
            <span class="skill-cat-arrow" :class="{ open: skillCats.frontend }">&#9656;</span>
            <DecryptedText :text="$t('resume.skills.frontend')" v-bind="animProps" />
          </a>
          <p v-if="skillCats.frontend" class="skill-cat-items">
            <a class="txtanim link-color-react" href="https://react.dev" target="_blank"><DecryptedText text="React" v-bind="animProps" /></a><DecryptedText text=", " v-bind="animProps" /><a class="txtanim link-color-react" href="https://angular.dev" target="_blank"><DecryptedText text="Angular" v-bind="animProps" /></a><DecryptedText text=", " v-bind="animProps" /><a class="txtanim link-color-vue" href="https://vuejs.org" target="_blank"><DecryptedText text="Vue" v-bind="animProps" /></a><DecryptedText text=", Component libraries, Responsive design" v-bind="animProps" />
          </p>
        </div>

        <!-- Backend & Databases -->
        <div class="skill-cat">
          <a class="txtanim link-color-projects skill-cat-label" @click="toggleCat('backend')">
            <span class="skill-cat-arrow" :class="{ open: skillCats.backend }">&#9656;</span>
            <DecryptedText :text="$t('resume.skills.backend')" v-bind="animProps" />
          </a>
          <p v-if="skillCats.backend" class="skill-cat-items">
            <a class="txtanim link-color-projects" href="https://nodejs.org" target="_blank"><DecryptedText text="Node.js" v-bind="animProps" /></a><DecryptedText text=", " v-bind="animProps" /><a class="txtanim link-color-web" href="https://bun.sh" target="_blank"><DecryptedText text="Bun" v-bind="animProps" /></a><DecryptedText text=", REST APIs, " v-bind="animProps" /><a class="txtanim link-color-web" href="https://www.mysql.com" target="_blank"><DecryptedText text="MySQL" v-bind="animProps" /></a><DecryptedText text=", " v-bind="animProps" /><a class="txtanim link-color-cpp" href="https://www.postgresql.org" target="_blank"><DecryptedText text="Postgres" v-bind="animProps" /></a><DecryptedText text=", MSSQL, NoSQL" v-bind="animProps" />
          </p>
        </div>

        <!-- Cloud & Infrastructure -->
        <div class="skill-cat">
          <a class="txtanim link-color-react skill-cat-label" @click="toggleCat('cloud')">
            <span class="skill-cat-arrow" :class="{ open: skillCats.cloud }">&#9656;</span>
            <DecryptedText :text="$t('resume.skills.cloud')" v-bind="animProps" />
          </a>
          <p v-if="skillCats.cloud" class="skill-cat-items">
            <a class="txtanim link-color-react" href="https://cloud.google.com" target="_blank"><DecryptedText text="Google Cloud Platform" v-bind="animProps" /></a><DecryptedText text=", " v-bind="animProps" /><a class="txtanim link-color-web" href="https://www.docker.com" target="_blank"><DecryptedText text="Docker" v-bind="animProps" /></a><DecryptedText text=", " v-bind="animProps" /><a class="txtanim link-color-projects" href="https://nginx.org" target="_blank"><DecryptedText text="Nginx" v-bind="animProps" /></a><DecryptedText text=", Container orchestration, " v-bind="animProps" /><a class="txtanim link-color-rust" href="https://min.io" target="_blank"><DecryptedText text="Minio" v-bind="animProps" /></a>
          </p>
        </div>

        <!-- Industrial IoT & SCADA -->
        <div class="skill-cat">
          <a class="txtanim link-color-rust skill-cat-label" @click="toggleCat('iot')">
            <span class="skill-cat-arrow" :class="{ open: skillCats.iot }">&#9656;</span>
            <DecryptedText :text="$t('resume.skills.iot')" v-bind="animProps" />
          </a>
          <p v-if="skillCats.iot" class="skill-cat-items">
            <DecryptedText text="Modbus TCP/IP, Industrial automation protocols, PLC programming, Real-time telemetry systems" v-bind="animProps" />
          </p>
        </div>

        <!-- AI / ML -->
        <div class="skill-cat">
          <a class="txtanim link-color-py skill-cat-label" @click="toggleCat('ai')">
            <span class="skill-cat-arrow" :class="{ open: skillCats.ai }">&#9656;</span>
            <DecryptedText :text="$t('resume.skills.ai')" v-bind="animProps" />
          </a>
          <p v-if="skillCats.ai" class="skill-cat-items">
            <DecryptedText text="Large Language Models, RAG architecture, Model deployment, Computer vision" v-bind="animProps" />
          </p>
        </div>

        <!-- Real-time Systems -->
        <div class="skill-cat">
          <a class="txtanim link-color-js skill-cat-label" @click="toggleCat('realtime')">
            <span class="skill-cat-arrow" :class="{ open: skillCats.realtime }">&#9656;</span>
            <DecryptedText :text="$t('resume.skills.realtime')" v-bind="animProps" />
          </a>
          <p v-if="skillCats.realtime" class="skill-cat-items">
            <DecryptedText text="WebSockets, Real-time data synchronization, Messaging platforms integration" v-bind="animProps" />
          </p>
        </div>

        <!-- DevOps -->
        <div class="skill-cat">
          <a class="txtanim link-color-linux skill-cat-label" @click="toggleCat('devops')">
            <span class="skill-cat-arrow" :class="{ open: skillCats.devops }">&#9656;</span>
            <DecryptedText :text="$t('resume.skills.devops')" v-bind="animProps" />
          </a>
          <p v-if="skillCats.devops" class="skill-cat-items">
            <a class="txtanim link-color-web" href="https://git-scm.com" target="_blank"><DecryptedText text="Git" v-bind="animProps" /></a><DecryptedText text=", " v-bind="animProps" /><a class="txtanim link-color-linux" href="https://kernel.org" target="_blank"><DecryptedText text="Linux" v-bind="animProps" /></a><DecryptedText text=" (Arch, Debian, Ubuntu, Kali), System automation, CI/CD" v-bind="animProps" />
          </p>
        </div>

        <!-- Specialized -->
        <div class="skill-cat">
          <a class="txtanim link-color-cpp skill-cat-label" @click="toggleCat('specialized')">
            <span class="skill-cat-arrow" :class="{ open: skillCats.specialized }">&#9656;</span>
            <DecryptedText :text="$t('resume.skills.specialized')" v-bind="animProps" />
          </a>
          <p v-if="skillCats.specialized" class="skill-cat-items">
            <DecryptedText text="Enterprise platform architecture, Digital signatures integration, Document generation, Visual workflow builders" v-bind="animProps" />
          </p>
        </div>

        <!-- Languages -->
        <div class="skill-cat">
          <a class="txtanim link-color-edu skill-cat-label" @click="toggleCat('langs')">
            <span class="skill-cat-arrow" :class="{ open: skillCats.langs }">&#9656;</span>
            <DecryptedText :text="$t('resume.skills.langs')" v-bind="animProps" />
          </a>
          <p v-if="skillCats.langs" class="skill-cat-items">
            <DecryptedText text="Portuguese (Native), English (Fluent), Spanish (Proficient), Italian (Basic), Russian (Learning)" v-bind="animProps" />
          </p>
        </div>
      </div>
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

/* ── Skill categories ──────────────────────────────── */
.skill-categories {
  margin-top: var(--spacing-sm);
  list-style: none;
  padding: 0;
}

.skill-cat {
  pointer-events: auto;
}

.skill-cat-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  line-height: 1.6;
}

.skill-cat-arrow {
  display: inline-block;
  font-size: 0.65em;
  transition: transform 0.2s ease;
  color: var(--color-text-tertiary);
}

.skill-cat-arrow.open {
  transform: rotate(90deg);
}

.skill-cat-items {
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin-top: var(--spacing-sm);
  padding-left: 1em;
}

.skill-cat-items a {
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
