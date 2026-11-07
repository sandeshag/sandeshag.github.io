import { site } from '../data/site.js'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.bar}`}>
        <div>
          <p className={styles.name}>{site.name}</p>
          <p className={styles.role}>{site.role}</p>
        </div>

        <nav className={styles.links} aria-label="Footer">
          {site.nav.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a href="#top">Back to top ↑</a>
        </nav>

        <p className={styles.copy}>
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  )
}