import { about } from '../data/about.js'
import { site } from '../data/site.js'
import styles from './About.module.css'

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.text}>
          <div className={styles.top}>
            <p className={styles.eyebrow}>{about.eyebrow}</p>
            <p className={styles.index}>{about.index}</p>
          </div>

          <h2 className={styles.heading}>{about.heading}</h2>

          <div className={styles.body}>
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <ul className={styles.stats}>
            {site.stats.map((stat) => (
              <li key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </li>
            ))}
          </ul>

          <dl className={styles.facts}>
            <div>
              <dt>{about.methodsLabel}</dt>
              <dd>{about.methods}</dd>
            </div>
            <div>
              <dt>{about.beliefLabel}</dt>
              <dd>{about.belief}</dd>
            </div>
          </dl>

          <p className={styles.signature}>{about.signature}</p>
        </div>

        <figure className={styles.figure}>
          <img src={about.portrait.src} alt={about.portrait.alt} loading="lazy" decoding="async" />
          <figcaption>{about.portrait.caption}</figcaption>
        </figure>
      </div>
    </section>
  )
}