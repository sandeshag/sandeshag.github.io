import { useEffect, useRef, useState } from 'react'
import { site } from '../data/site.js'
import { useActiveSection } from '../hooks/useActiveSection.ts'
import styles from './Navbar.module.css'

const sectionIds = [
  'about',
  'education',
  'journey',
  'training',
  'research',
  'publications',
  'recognition',
  'contact',
]
const aliases = { education: 'about', training: 'journey' }

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const progress = useRef<HTMLDivElement>(null)
  const active = useActiveSection(sectionIds, aliases)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
      const max = document.documentElement.scrollHeight - window.innerHeight
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0
      if (progress.current) progress.current.style.transform = `scaleX(${ratio})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <header className={`${styles.header} ${scrolled || open ? styles.solid : ''}`}>
      <div className={`container ${styles.bar}`}>
        <a href="#top" className={styles.brand} onClick={close}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 21V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M12 12C12 8 9 5.5 4.5 5.5 4.5 9.5 7.5 12 12 12Z" fill="currentColor" />
            <path d="M12 14.5C12 11.5 14.2 9.5 18.5 9.5 18.5 12.8 16.2 14.5 12 14.5Z" fill="currentColor" opacity="0.65" />
          </svg>
          <span>{site.name}</span>
        </a>

        <nav
          id="primary-nav"
          className={`${styles.nav} ${open ? styles.open : ''}`}
          aria-label="Primary"
        >
          {site.nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.href === `#${active}` ? 'true' : undefined}
              onClick={close}
            >
              {link.label}
            </a>
          ))}
          <a href={site.cta.href} className={styles.cta} onClick={close}>
            {site.cta.label}
            <svg
              className={styles.arrow}
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 9 9 3M4 3h5v5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </nav>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
      <div ref={progress} className={styles.progress} aria-hidden="true" />
    </header>
  )
}