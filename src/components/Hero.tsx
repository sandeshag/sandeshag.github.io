import { hero } from '../data/hero.js'
import { site } from '../data/site.js'
import SoilScene from './SoilScene.tsx'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.meta}>
          <p className="eyebrow">{hero.eyebrow}</p>
          <p className={styles.location}>{hero.location}</p>
        </div>

        <h1 className={styles.headline}>
          {hero.headline.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>

        <div className={styles.grid}>
          <figure className={styles.figure}>
            <SoilScene links={site.socials} label={hero.scene.alt} />
            <figcaption>
              <span className="eyebrow">{hero.scene.label}</span>
              <span className={styles.note}>{hero.scene.note}</span>
            </figcaption>
          </figure>

          <div className={styles.side}>
            <p className={styles.description}>{hero.description}</p>
            <div className={styles.actions}>
              <a href={hero.primaryAction.href} className={styles.primary}>
                {hero.primaryAction.label}
              </a>
              <a href={hero.secondaryAction.href} className={styles.secondary}>
                {hero.secondaryAction.label}
                <span aria-hidden="true"> →</span>
              </a>
            </div>
            <p className={styles.status}>{hero.status}</p>
          </div>
        </div>
      </div>
    </section>
  )
}