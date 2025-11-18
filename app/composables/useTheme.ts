export type Theme = 'light' | 'dark'

export const useTheme = () => {
  const theme = useState<Theme>('theme', () => 'light')

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme

    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', newTheme)
      localStorage.setItem('theme', newTheme)
    }
  }

  const toggleTheme = (event?: MouseEvent) => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light'

    if (import.meta.client && event && typeof document !== 'undefined' && 'startViewTransition' in document) {
      const x = event.clientX
      const y = event.clientY

      // Set CSS variables for the click position
      const root = document.documentElement
      root.style.setProperty('--click-x', `${x}px`)
      root.style.setProperty('--click-y', `${y}px`)

      // Use View Transition API if supported
      const transition = (document as any).startViewTransition(() => {
        setTheme(newTheme)
      })
    } else {
      setTheme(newTheme)
    }
  }

  const initTheme = () => {
    if (import.meta.client) {
      const savedTheme = localStorage.getItem('theme') as Theme | null
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
      setTheme(initialTheme)
    }
  }

  return {
    theme: readonly(theme),
    setTheme,
    toggleTheme,
    initTheme
  }
}
