import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <div className="wrap">
        <p className={`display ${styles.kicker}`}>Southern American · Since 2024</p>
        <h1 className={`script ${styles.headline}`}>The Woodpecker</h1>
        <p className={`display ${styles.sub}`}>D · I · N · E · R</p>
        <p className={styles.tagline}>
          Southern comfort food uit Dordrecht — gegrild en gerookt op de{' '}
          <strong className={styles.josper}>Josper</strong> houtskooloven. Van pastrami tot half
          gebraden eend, met cocktails die kloppen.
        </p>
        <div className={styles.buttons}>
          <a href="#menu" className="btn primary">Bekijk het menu</a>
          <a href="#reserveren" className="btn">Reserveer een tafel</a>
        </div>
        <Bird />
      </div>
    </section>
  )
}

function Bird() {
  return (
    <svg className={styles.bird} viewBox="0 0 100 120" role="img" aria-label="Specht">
      <path d="M52 6c7 3 10 9 9 17l-14-2z" fill="#C8563A" />
      <path d="M30 74c-6 12-14 20-24 24 12 2 22-2 30-11z" fill="#2D1B1D" />
      <ellipse cx="52" cy="70" rx="24" ry="30" fill="#2D1B1D" />
      <circle cx="55" cy="33" r="19" fill="#2D1B1D" />
      <path d="M42 26c-4-6-3-12 3-17 1 6 4 10 9 12z" fill="#C8563A" />
      <path d="M72 30l24 6-24 9z" fill="#C8563A" />
      <path d="M74 36l22 0-22 5z" fill="#241417" opacity="0.25" />
      <circle cx="60" cy="30" r="5" fill="#F5E6D3" />
      <circle cx="61" cy="31" r="2.4" fill="#241417" />
      <path d="M44 52c12 4 22 4 30-2 4 14 1 27-9 36-9-2-16-8-21-16z" fill="#F5E6D3" />
      <path d="M60 60c8-1 13-4 16-8 3 11 1 21-6 29-5-6-8-13-10-21z" fill="#C8563A" opacity="0.85" />
      <path d="M48 99l-3 12h6l3-11zM60 99l1 12h6l-2-12z" fill="#C8563A" />
    </svg>
  )
}
