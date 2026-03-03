<script setup lang="ts">
const { t } = useI18n()

const projects = computed(() => [
  {
    title: t('projectsList.ai.title'),
    description: t('projectsList.ai.description'),
    skills: ['Python', 'TensorFlow', 'PyTorch'],
    link: '/projects/ai',
    color: 'var(--color-primary)'
  },
  {
    title: t('projectsList.crm.title'),
    description: t('projectsList.crm.description'),
    skills: ['Node.js', 'Vue.js', 'PostgreSQL'],
    link: '/projects/crm',
    color: 'var(--color-success)'
  },
  {
    title: t('projectsList.supervisorio.title'),
    description: t('projectsList.supervisorio.description'),
    skills: ['C++', 'Qt', 'Modbus'],
    link: '/projects/supervisorio',
    color: 'var(--color-warning)'
  },
  {
    title: t('projectsList.telemetry.title'),
    description: t('projectsList.telemetry.description'),
    skills: ['Go', 'InfluxDB', 'Grafana'],
    link: '/projects/telemetry',
    color: 'var(--color-info)'
  },
  {
    title: t('projectsList.pwa.title'),
    description: t('projectsList.pwa.description'),
    skills: ['Nuxt', 'Service Workers', 'TypeScript'],
    link: '/projects/pwa',
    color: 'var(--color-secondary)'
  },
  {
    title: t('projectsList.whatsapp.title'),
    description: t('projectsList.whatsapp.description'),
    skills: ['Node.js', 'WhatsApp API', 'Webhooks'],
    link: '/projects/whatsapp',
    color: '#25D366'
  },
  {
    title: t('projectsList.portfolio.title'),
    description: t('projectsList.portfolio.description'),
    skills: ['Nuxt', 'Three.js', 'CSS'],
    link: '/projects/portfolio',
    color: 'var(--color-text-primary)'
  },
  {
    title: t('projectsList.linux.title'),
    description: t('projectsList.linux.description'),
    skills: ['Bash', 'System Administration', 'Kernel'],
    link: '/projects/linux',
    color: '#FCC624'
  }
])

const sectionRefs = ref<HTMLElement[]>([])
let rafId = 0
let scrollTicking = false

const updateAnimations = () => {
  const windowHeight = window.innerHeight

  sectionRefs.value.forEach((el) => {
    if (!el) return

    const rect = el.getBoundingClientRect()

    // Entry animation (bottom up)
    const entryStart = windowHeight
    const entryEnd = windowHeight * 0.8

    // Exit animation (top out)
    const exitStart = windowHeight * 0.2
    const exitEnd = 0

    let opacity = 1
    let transformY = 0
    let scale = 1

    if (rect.top > entryEnd) {
      // Entering from bottom
      let progress = (entryStart - rect.top) / (entryStart - entryEnd)
      progress = Math.min(Math.max(progress, 0), 1)

      opacity = progress
      transformY = 100 * (1 - progress)
      scale = 0.9 + (0.1 * progress)
    } else if (rect.bottom < exitStart) {
      // Exiting to top
      let progress = (rect.bottom - exitEnd) / (exitStart - exitEnd)
      progress = Math.min(Math.max(progress, 0), 1)

      opacity = progress
      transformY = -100 * (1 - progress)
      scale = 0.9 + (0.1 * progress)
    }

    // Apply styles directly based on scroll position
    el.style.opacity = opacity.toString()
    el.style.transform = `translateY(${transformY}px) scale(${scale})`
  })

  scrollTicking = false
}

const onScroll = () => {
  if (!scrollTicking) {
    scrollTicking = true
    rafId = requestAnimationFrame(updateAnimations)
  }
}

const getSkillClass = (skill: string) => {
  const map: Record<string, string> = {
    'JavaScript': 'link-color-js',
    'Python': 'link-color-py',
    'C++': 'link-color-cpp',
    'Rust': 'link-color-rust',
    'React': 'link-color-react',
    'Vue.js': 'link-color-vue',
    'Nuxt': 'link-color-vue',
    'Linux': 'link-color-linux',
    'Bash': 'link-color-linux',
    'Node.js': 'link-color-projects',
    'TensorFlow': 'link-color-rust', // Orange-ish
    'PyTorch': 'link-color-rust',    // Orange-ish
    'Go': 'link-color-react',        // Cyan-ish
    'InfluxDB': 'link-color-edu',    // Brown/Dark
    'Grafana': 'link-color-rust',    // Orange
    'Qt': 'link-color-vue',          // Green
    'Modbus': 'link-color-edu',
    'TypeScript': 'link-color-js',   // Yellow/Blue
    'Service Workers': 'link-color-web',
    'WhatsApp API': 'link-color-vue', // Green
    'Webhooks': 'link-color-web',
    'Three.js': 'link-color-web',
    'CSS': 'link-color-web',
    'System Administration': 'link-color-linux',
    'Kernel': 'link-color-linux'
  }
  return map[skill] || 'link-color'
}

onMounted(() => {
  // Initial position pass
  updateAnimations()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div class="projects-wrapper">
    <div class="projects-container">
      <div 
        v-for="(project, index) in projects" 
        :key="project.title" 
        ref="sectionRefs"
        class="project-section"
      >
        <NuxtLink :to="project.link" class="project-card">
          <div class="project-visual" :style="{ '--project-color': project.color }">
            <div class="visual-content">
              <span class="project-initials">{{ project.title.substring(0, 2) }}</span>
            </div>
          </div>
          <div class="project-content">
            <h2 class="project-title">{{ project.title }}</h2>
            <p class="project-description">{{ project.description }}</p>
            <div class="project-skills">
              <span 
                v-for="skill in project.skills" 
                :key="skill" 
                class="skill-tag"
                :class="getSkillClass(skill)"
              >{{ skill }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.projects-wrapper {
  position: relative;
  width: 100%;
}

.projects-container {
  position: relative;
  z-index: 5;
  padding: var(--spacing-2xl) var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: 10vh;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  pointer-events: none;
  margin-top: 60vh;
}

.project-section {
  width: 100%;
  pointer-events: auto;
  opacity: 0;
  /* Initial state handled by JS, but set defaults to avoid FOUC */
  will-change: transform, opacity;
}

.project-card {
  text-decoration: none;
  color: inherit;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  align-items: center;
  padding: var(--spacing-xl);
  border-radius: var(--radius-xl);
  transition: background-color 0.3s ease; /* Removed transform transition to avoid conflict with JS */
}

.project-card:hover {
  /* Removed scale transform on hover to avoid conflict with scroll animation */
  background-color: rgba(125, 125, 125, 0.05);
}

.project-visual {
  height: 300px;
  width: 100%;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--color-background), var(--project-color));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: box-shadow 0.3s ease;
}

.project-card:hover .project-visual {
  box-shadow: var(--shadow-xl);
}

.project-visual::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.1) 100%);
}

.visual-content {
  font-size: 5rem;
  font-weight: 900;
  color: var(--color-text-primary);
  opacity: 0.1;
  font-family: var(--font-mono);
  letter-spacing: -0.05em;
}

.project-content {
  padding: var(--spacing-md);
  text-align: left;
}

.project-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

.project-description {
  color: var(--color-text-primary);
  opacity: 0.9;
  font-weight: 500;
  margin-bottom: var(--spacing-lg);
  line-height: 1.7;
  font-size: 1.1rem;
}

.project-skills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.skill-tag {
  /* Inherit txtanim properties for link animation */
  --time: 400ms;
  --bg-small-size: 4px;
  --padding-top: 2px;
  --padding-sides: 2px;
  --padding-bottom: 1px;
  
  /* Base styles required for the animation */
  background-color: transparent;
  transition: background-size, background-position var(--time) ease-in-out 0s;
  background-size: 100% 200%;
  background-position: 0 0;
  cursor: pointer;
  
  /* Font styles */
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 600;
}

.skill-tag:hover {
  background-position: 0 100%;
}



/* Alternate layout for even items */
.project-section:nth-child(even) .project-card {
  grid-template-columns: 1fr 1fr;
  direction: rtl; /* Quick way to swap columns visually */
}

.project-section:nth-child(even) .project-content {
  direction: ltr; /* Reset text direction */
  text-align: right; /* Align text to right for variety */
}

.project-section:nth-child(even) .project-skills {
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .project-card, 
  .project-section:nth-child(even) .project-card {
    grid-template-columns: 1fr;
    direction: ltr;
    gap: var(--spacing-md);
    text-align: center;
  }

  .project-section:nth-child(even) .project-content {
    text-align: center;
  }

  .project-section:nth-child(even) .project-skills {
    justify-content: center;
  }

  .project-skills {
    justify-content: center;
  }

  .project-visual {
    height: 250px;
  }

  .projects-container {
    margin-top: 40vh;
  }
  
  .scroll-indicator {
    top: 35vh;
  }
}
</style>
