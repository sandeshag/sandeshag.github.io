import { education } from '../data/education.js'
import styles from './Education.module.css'

export default function Education() {
  return (
    <section id="education" className={styles.education}>
      <div className={`container ${styles.grid}`}>
        <header className={styles.intro}>
          <p className="eyebrow">{education.eyebrow}</p>
          <h2>{education.heading}</h2>
          <p className={styles.lead}>{education.intro}</p>
        </header>

        <ol className={styles.list}>
          {education.items.map((item) => (
            <li key={item.qualification} className={styles.item}>
              <p className={styles.dates}>{item.dates}</p>
              <div>
                <h3>{item.qualification}</h3>
                <p className={styles.institution}>{item.institution}</p>
                {item.thesis && (
                  <p className={styles.thesis}>
                    <span>Thesis</span>
                    {item.thesis}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}