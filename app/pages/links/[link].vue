<template>
  <div />
</template>

<script setup lang="ts">
const route = useRoute()
const link = route.params.link as string

const ghLang = (lang: string) =>
  `https://github.com/GabriWar?tab=repositories&q=&type=source&language=${lang}&sort=`

const links: Record<string, string> = {
  '1': 'https://github.com/GabriWar/',
  '2': ghLang('javascript'),
  '3': ghLang('vue'),
  '4': ghLang('c%2B%2B'),
  '5': ghLang('rust'),
  '6': ghLang('python'),
  '7': 'https://github.com/GabriWar/LARBS',
  '8': ghLang('go'),
  '9': ghLang('typescript'),
  '10': ghLang('shell'),
  '11': ghLang('c'),
  '12': ghLang('lua'),
}

if (links[link]) {
  navigateTo(links[link], { external: true })
}
</script>
