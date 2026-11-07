import { research } from '../data/research.js'
import styles from './Research.module.css'

export default function Research() {
  return (
    <section id="research" className={styles.research}>
      <div className="container">
        <header className={styles.header}>
          <p className={styles.eyebrow}>{research.eyebrow}</p>
          <h2>{research.heading}</h2>
          <p className={styles.intro}>{research.intro}</p>
        </header>

        <ol className={styles.list}>
          {research.projects.map((project, i) => (
            <li
              key={project.title}
              className={`${styles.item} ${project.image ? styles.withImage : ''}`}
            >
              <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
              <div className={styles.content}>
                <span className={styles.tag}>{project.tag}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
              {project.image && (
                <img src={project.image.src} alt={project.image.alt} className={styles.image} />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}