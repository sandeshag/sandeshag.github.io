import { experience } from '../data/experience.js'
import styles from './Experience.module.css'

export default function Experience() {
  return (
    <section id="journey" className={styles.experience}>
      <div className="container">
        <header className={styles.header}>
          <p className={styles.eyebrow}>{experience.eyebrow}</p>
          <h2>{experience.heading}</h2>
          <p className={styles.intro}>{experience.intro}</p>
        </header>

        {experience.groups.map((group) => (
          <div key={group.title} className={styles.group}>
            <h3 className={styles.groupTitle}>{group.title}</h3>

            <ol className={styles.list}>
              {group.items.map((item) => (
                <li key={`${item.role}-${item.dates}`} className={styles.item}>
                  <p className={styles.dates}>
                    {item.dates}
                    {item.current && <span className={styles.badge}>Current</span>}
                  </p>
                  <div>
                    <h4>{item.role}</h4>
                    <p className={styles.org}>{item.org}</p>
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
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  )
}