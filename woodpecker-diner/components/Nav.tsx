'use client'

import { useState } from 'react'
import styles from './Nav.module.css'

const LINKS = [
  { href: '#lunch', label: 'Lunch' },
  { href: '#diner', label: 'Diner' },
  { href: '#drinks', label: 'Drinks' },
  { href: '#over-ons', label: 'Over ons' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className={styles.nav}>
      <div className={`wrap ${styles.inner}`}>
        <a href="#top" className={styles.brand} onClick={() => setOpen(false)}>
          <span className={`script ${styles.brandName}`}>The Woodpecker</span>
          <span className={`display ${styles.brandSub}`}>Diner · Dordrecht</span>
        </a>

        <button
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="hoofdmenu"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span /> <span /> <span />
        </button>

        <nav id="hoofdmenu" className={`${styles.links} ${open ? styles.linksOpen : ''}`}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className={`display ${styles.link}`} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#reserveren" className={`btn primary ${styles.cta}`} onClick={() => setOpen(false)}>
            Reserveren
          </a>
        </nav>
      </div>
    </header>
  )
}
