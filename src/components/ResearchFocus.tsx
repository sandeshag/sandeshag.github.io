import { hero } from '../data/hero.js'
import styles from './ResearchFocus.module.css'

export default function ResearchFocus() {
  return (
    <section className={styles.focus} aria-labelledby="focus-title">
      <div className="container">
        <h2 id="focus-title" className={`eyebrow ${styles.title}`}>
          {hero.focusTitle}
        </h2>
        <ul className={styles.list}>
          {hero.focus.map((item, i) => (
            <li key={item}>
              <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.name}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}