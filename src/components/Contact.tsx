import { contact } from '../data/contact.js'
import { site } from '../data/site.js'
import styles from './Contact.module.css'

export default function Contact() {
  const whatsapp = `https://wa.me/${site.phone.replace(/\D/g, '')}`
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}`

  return (
    <section id="contact" className={styles.contact}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.lead}>
          <p className="eyebrow">{contact.eyebrow}</p>
          <h2>{contact.heading}</h2>
          <p className={styles.intro}>{contact.intro}</p>
          <a href={gmail} target="_blank" rel="noopener noreferrer" className={styles.primary}>
            {contact.primaryLabel}
          </a>
        </div>

        <dl className={styles.details}>
          <div>
            <dt>{contact.labels.email}</dt>
            <dd>
              <a href={gmail} target="_blank" rel="noopener noreferrer">
                {site.email} <span aria-hidden="true">↗</span>
              </a>
            </dd>
          </div>
          <div>
            <dt>{contact.labels.phone}</dt>
            <dd>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                {site.phone} <span aria-hidden="true">↗</span>
              </a>
            </dd>
          </div>
          <div>
            <dt>{contact.labels.location}</dt>
            <dd>{site.location}</dd>
          </div>
          <div>
            <dt>{contact.labels.ngo}</dt>
            <dd>
              <a href={site.ngo.href} target="_blank" rel="noopener noreferrer">
                {site.ngo.label} <span aria-hidden="true">↗</span>
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}