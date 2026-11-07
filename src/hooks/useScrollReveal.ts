import { useLayoutEffect } from 'react'

export function useScrollReveal(selector: string) {
  useLayoutEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(selector)
    if (!('IntersectionObserver' in window)) return

    els.forEach((el) => el.classList.add('reveal'))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -6% 0px' },
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [selector])
}