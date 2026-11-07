import { useCallback, useEffect, useRef, useState } from 'react'
import { training } from '../data/training.js'
import styles from './Training.module.css'

export default function Training() {
  const track = useRef<HTMLUListElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  const update = useCallback(() => {
    const el = track.current
    if (!el) return
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    })
  }, [])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update])

  const slide = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('li')
    const step = card ? card.offsetWidth * 1.6 : 400
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <section id="training" className={styles.training}>
      <div className="container">
        <header className={styles.header}>
          <div>
            <p className="eyebrow">{training.eyebrow}</p>
            <h2>{training.heading}</h2>
          </div>
          <div className={styles.side}>
            <p className={styles.intro}>{training.intro}</p>
            <div className={styles.controls}>
              <button
                type="button"
                className={styles.arrowBtn}
                onClick={() => slide(-1)}
                disabled={edge.start}
                aria-label="Previous trainings"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M13 8H3m4.5-4.5L3 8l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                className={styles.arrowBtn}
                onClick={() => slide(1)}
                disabled={edge.end}
                aria-label="Next trainings"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <ul
          ref={track}
          className={styles.track}
          onScroll={update}
          tabIndex={0}
          aria-label="Workshops and trainings, scroll sideways to browse"
        >
          {training.items.map((item, i) => (
            <li
              key={`${item.title}-${item.dates}`}
              className={`${styles.card} ${styles[`v${i % 5}`]}`}
            >
              <div className={styles.media}>
                {item.image ? (
                  <img src={item.image} alt="" loading="lazy" />
                ) : (
                  <span className={styles.year} aria-hidden="true">
                    {item.year}
                  </span>
                )}
                <span className={styles.tag}>{item.tag}</span>
              </div>

              <div className={styles.body}>
                <p className={styles.meta}>
                  {item.month} · {item.duration}
                  {item.role && <> · {item.role}</>}
                </p>
                <h3>{item.title}.</h3>
                <p className={styles.organizer}>{item.organizer}</p>
                {item.note && <p className={styles.note}>{item.note}</p>}
                <p className={styles.when}>
                  {item.dates}
                  {item.place && <> · {item.place}</>}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}