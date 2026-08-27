'use client'

import { useState, type FormEvent } from 'react'
import { SITE } from '@/data/site'
import styles from './Reserve.module.css'

const TIJDEN = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
]

type Status = 'idle' | 'bezig' | 'gelukt' | 'fout'

export default function Reserve() {
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    setStatus('bezig')

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('mislukt')
      setStatus('gelukt')
      form.reset()
    } catch {
      setStatus('fout')
      window.location.href = mailtoLink(data)
    }
  }

  return (
    <section id="reserveren" className={`section ${styles.reserve}`}>
      <div className={`wrap ${styles.grid}`}>
        <div>
          <h2 className={`script ${styles.titel}`}>Reserveren</h2>
          <p className={styles.intro}>
            Tafel voor vanavond of over drie weken — laat je gegevens achter en we bevestigen per
            mail. Groter dan 12 personen? Bel ons even.
          </p>

          <form className={styles.form} onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="date">Datum</label>
              <input id="date" name="date" type="date" required />
            </div>

            <div className="field">
              <label htmlFor="time">Tijd</label>
              <select id="time" name="time" required defaultValue="19:00">
                {TIJDEN.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="guests">Aantal gasten</label>
              <select id="guests" name="guests" required defaultValue="2">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="name">Naam</label>
              <input id="name" name="name" type="text" autoComplete="name" required />
            </div>

            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input id="email" name="email" type="email" autoComplete="email" required />
            </div>

            <div className="field">
              <label htmlFor="phone">Telefoon</label>
              <input id="phone" name="phone" type="tel" autoComplete="tel" required />
            </div>

            <div className={`field ${styles.breed}`}>
              <label htmlFor="note">Opmerking</label>
              <textarea id="note" name="note" placeholder="Allergie, kinderstoel, verjaardag…" />
            </div>

            <button type="submit" className={`btn primary ${styles.breed}`} disabled={status === 'bezig'}>
              {status === 'bezig' ? 'Versturen…' : 'Verstuur reservering'}
            </button>

            {status === 'gelukt' && (
              <p className={`${styles.melding} ${styles.gelukt} ${styles.breed}`} role="status">
                Gelukt — je aanvraag staat bij ons. Je krijgt binnen een paar uur een bevestiging per
                mail.
              </p>
            )}
            {status === 'fout' && (
              <p className={`${styles.melding} ${styles.fout} ${styles.breed}`} role="status">
                Versturen lukte even niet. We openen je mailprogramma met de gegevens erin — of bel
                ons op {SITE.telefoon}.
              </p>
            )}
          </form>
        </div>

        <aside className={styles.kaart}>
          <h3 className={`display ${styles.kaartTitel}`}>Vind ons</h3>
          <p className={styles.regel}>{SITE.adres}</p>
          <p className={styles.regel}>
            <a className={styles.link} href={SITE.telefoonHref}>{SITE.telefoon}</a>
          </p>
          <p className={styles.regel}>
            <a className={styles.link} href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>

          <h3 className={`display ${styles.kaartTitel}`}>Openingstijden</h3>
          <ul>
            {SITE.openingstijden.map((o) => (
              <li key={o.dagen} className={styles.tijdRegel}>
                <span>{o.dagen}</span>
                <span>{o.uren}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  )
}

function mailtoLink(d: Record<string, string>) {
  const body = [
    `Naam: ${d.name}`,
    `Datum: ${d.date}`,
    `Tijd: ${d.time}`,
    `Aantal gasten: ${d.guests}`,
    `E-mail: ${d.email}`,
    `Telefoon: ${d.phone}`,
    `Opmerking: ${d.note || '-'}`,
  ].join('\n')
  return `mailto:${SITE.email}?subject=${encodeURIComponent('Reservering ' + d.date + ' ' + d.time)}&body=${encodeURIComponent(body)}`
}
