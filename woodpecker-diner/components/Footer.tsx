import { SITE } from '@/data/site'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.grid}`}>
        <div>
          <p className={`script ${styles.merk}`}>The Woodpecker</p>
          <p className={`display ${styles.merkSub}`}>Diner · Dordrecht</p>
          <p className={styles.tekst}>
            Southern comfort food van de Josper houtskooloven.
          </p>
          <div className={styles.social}>
            <a href={SITE.instagram} aria-label="Instagram" className={styles.icoon}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href={SITE.facebook} aria-label="Facebook" className={styles.icoon}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.2-1.5 1.5-1.5H16.4V5.1C16.1 5.1 15.2 5 14.2 5c-2.1 0-3.6 1.3-3.6 3.8V11H8.2v3h2.4v7z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h3 className={`display ${styles.kop}`}>Menu</h3>
          <ul className={styles.lijst}>
            <li><a href="#lunch">Lunch</a></li>
            <li><a href="#diner">Diner</a></li>
            <li><a href="#drinks">Drinks</a></li>
          </ul>
        </div>

        <div>
          <h3 className={`display ${styles.kop}`}>Contact</h3>
          <ul className={styles.lijst}>
            <li>{SITE.adres}</li>
            <li><a href={SITE.telefoonHref}>{SITE.telefoon}</a></li>
            <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li><a href="#reserveren">Reserveer een tafel</a></li>
          </ul>
        </div>
      </div>

      <p className={styles.copyright}>
        © {new Date().getFullYear()} The Woodpecker Diner · Dordrecht — Alle prijzen in euro&apos;s,
        incl. btw.
      </p>
    </footer>
  )
}
