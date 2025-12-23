// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxtjs/i18n',
    'lenis/nuxt'
  ],

  css: ['~/assets/css/fonts.css', '~/assets/css/main.css'],

  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json'
      },
      {
        code: 'pt-BR',
        iso: 'pt-BR',
        name: 'Português (BR)',
        file: 'pt-BR.json'
      }
    ],
    defaultLocale: 'pt-BR',
    langDir: 'locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },

  fonts: {
    providers: {
      google: false
    }
  },

  nitro: {
    devServer: {
      port: 3069
    },
    preview: {
      port: 3069
    }
  }
})