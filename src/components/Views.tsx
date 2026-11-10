import { useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'
import { views } from '../data/views.js'
import styles from './Views.module.css'

const HEX: [number, number][] = [
  [22, 0],
  [78, 0],
  [100, 50],
  [78, 100],
  [22, 100],
  [0, 50],
]

function roundedPath(points: [number, number][], t: number) {
  const n = points.length
  const f = (v: number) => Number(v.toFixed(2))
  return (
    points
      .map(([x, y], i) => {
        const [px, py] = points[(i - 1 + n) % n]
        const [nx, ny] = points[(i + 1) % n]
        const a = `${f(x + (px - x) * t)} ${f(y + (py - y) * t)}`
        const b = `${f(x + (nx - x) * t)} ${f(y + (ny - y) * t)}`
        return `${i === 0 ? 'M' : 'L'}${a} Q${x} ${y} ${b}`
      })
      .join(' ') + ' Z'
  )
}

const HEX_PATH = roundedPath(HEX, 0.3)
const TYPE_LABELS: Record<string, string> = {
  podcast: 'Podcast',
  article: 'Article',
  radio: 'Radio show',
}

export default function Views() {
  const items = views.items
  const count = items.length
  const [nav, setNav] = useState(() => {
    const mid = Math.floor((count - 1) / 2)
    return { active: mid, prev: mid }
  })
  const active = Math.min(nav.active, count - 1)
  const prev = Math.min(nav.prev, count - 1)
  const half = Math.floor(count / 2)

  const circ = (i: number, a: number) => (((i - a + count + half) % count) + count) % count - half

  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startX = useRef<number | null>(null)
  const isDragging = useRef(false)
  const swiped = useRef(false)

  const go = (i: number) => {
    if (count < 2) return
    setNav({ active: ((i % count) + count) % count, prev: active })
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(active + 1)
    if (e.key === 'ArrowLeft') go(active - 1)
  }

  const reset = () => {
    startX.current = null
    isDragging.current = false
    setDragging(false)
    setDrag(0)
  }

  const onPointerDown = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    startX.current = e.clientX
    swiped.current = false
  }

  const onPointerMove = (e: PointerEvent<HTMLUListElement>) => {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    if (!isDragging.current) {
      if (Math.abs(dx) < 6) return
      isDragging.current = true
      setDragging(true)
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    setDrag(dx)
  }

  const onPointerUp = (e: PointerEvent<HTMLUListElement>) => {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    if (isDragging.current) {
      swiped.current = true
      if (Math.abs(dx) > 60) go(active + (dx < 0 ? 1 : -1))
    }
    reset()
  }

  return (
    <section id="views" className={styles.views}>
      <div className="container">
        <header className={styles.header}>
          <div>
            <p className="eyebrow">{views.eyebrow}</p>
            <h2>{views.heading}</h2>
          </div>
          <div className={styles.side}>
            <p className={styles.intro}>{views.intro}</p>
            {count > 1 && (
              <div className={styles.controls}>
                <button
                  type="button"
                  className={styles.arrowBtn}
                  onClick={() => go(active - 1)}
                  aria-label="Previous view"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M13 8H3m4.5-4.5L3 8l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={styles.arrowBtn}
                  onClick={() => go(active + 1)}
                  aria-label="Next view"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </header>

        <ul
          className={styles.stage}
          data-reach={Math.min(half, 3)}
          data-dragging={dragging}
          style={{ '--drag': `${drag}px` } as CSSProperties}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={reset}
          onDragStart={(e) => e.preventDefault()}
          aria-roledescription="carousel"
          aria-label="My views, use the arrow keys to browse"
        >
          {items.map((item, i) => {
            const offset = circ(i, active)
            const d = Math.abs(offset)
            const wrapped = offset !== circ(i, prev) - circ(active, prev)
            return (
              <li
                key={item.title}
                className={`${styles.card} ${styles[`v${i % 4}`]}`}
                data-d={d > 3 ? 'far' : d}
                data-wrap={wrapped}
                onAnimationEnd={(e) => {
                  if (wrapped && e.target === e.currentTarget) setNav((n) => ({ ...n, prev: n.active }))
                }}
                style={{ '--dir': offset < 0 ? -1 : 1 } as CSSProperties}
                onClick={() => {
                  if (d !== 0 && !swiped.current) go(i)
                }}
              >
                <svg className={styles.shape} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <path d={HEX_PATH} />
                </svg>

                <div className={styles.inner}>
                  <p className={styles.type}>{TYPE_LABELS[item.type] ?? 'Article'}</p>
                  <h3>{item.title}</h3>
                  <p className={styles.view}>{item.view}</p>

                  <div className={styles.foot}>
                    <p className={styles.meta}>
                      <span>{item.source}</span>
                      <span>{item.date}</span>
                    </p>
                    {item.link && (
                      <a
                        href={item.link.href}
                        className={styles.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${item.link.label}: ${item.title}`}
                      >
                        {item.link.label}
                      </a>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}