import { recognition } from '../data/recognition.js'
import styles from './Recognition.module.css'

export default function Recognition() {
  return (
    <section id="recognition" className={styles.recognition}>
      <div className="container">
        <header className={styles.header}>
          <p className={styles.eyebrow}>{recognition.eyebrow}</p>
          <h2>{recognition.heading}</h2>
        </header>

        <ul className={styles.grid}>
          {recognition.items.map((item) => (
            <li key={item.title} className={styles.card}>
              <span className={styles.year}>{item.year ?? '\u00A0'}</span>
              <h3>{item.title}</h3>
              <p className={styles.source}>{item.source}</p>
              {item.note && <p className={styles.note}>{item.note}</p>}
              {item.link && (
                <a
                  href={item.link.href}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.link.label} <span aria-hidden="true">↗</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}