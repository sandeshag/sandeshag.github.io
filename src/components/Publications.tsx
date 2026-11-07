import { publications } from '../data/publications.js'
import styles from './Publications.module.css'

export default function Publications() {
  return (
    <section id="publications" className={styles.publications}>
      <div className="container">
        <header className={styles.header}>
          <div>
            <p className="eyebrow">{publications.eyebrow}</p>
            <h2>{publications.heading}</h2>
          </div>
          <p className={styles.intro}>{publications.intro}</p>
        </header>

        <ul className={styles.list}>
          {publications.items.map((item) => {
            const source = item.authors ?? item.outlet
            return (
              <li key={item.title} className={styles.item}>
                <span className={styles.year}>{item.year}</span>
                <div className={styles.main}>
                  <h3>{item.title}</h3>
                  <p className={styles.meta}>
                    {[source, item.date].filter(Boolean).join(' · ')}
                  </p>
                  <p className={styles.tags}>
                    <span>{item.kind}</span>
                    {item.language && <span>{item.language}</span>}
                  </p>
                </div>
                {item.link && (
                  <a
                    href={item.link}
                    className={styles.read}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Read ${item.title}`}
                  >
                    Read <span aria-hidden="true">↗</span>
                  </a>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}