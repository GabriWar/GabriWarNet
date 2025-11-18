export const useTextScramble = () => {
  let currentInterval: NodeJS.Timeout | null = null
  const isAnimating = ref(false)

  const scramble = (
    element: HTMLElement | null,
    targetText: string,
    options: {
      speed?: number
      iterations?: number
      chars?: string
    } = {}
  ) => {
    if (!element || isAnimating.value) return

    const {
      speed = 30,
      iterations = 3,
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    } = options

    let iteration = 0
    isAnimating.value = true

    if (currentInterval) {
      clearInterval(currentInterval)
    }

    currentInterval = setInterval(() => {
      element.innerText = targetText
        .split('')
        .map((letter, index) => {
          if (index < iteration) {
            return targetText[index]
          }
          return chars[Math.floor(Math.random() * chars.length)]
        })
        .join('')

      if (iteration >= targetText.length) {
        clearInterval(currentInterval!)
        currentInterval = null
        isAnimating.value = false
      }

      iteration += 1 / iterations
    }, speed)
  }

  return {
    scramble,
    isAnimating: readonly(isAnimating)
  }
}
