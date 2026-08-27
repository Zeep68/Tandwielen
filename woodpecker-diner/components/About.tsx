import styles from './About.module.css'

export default function About() {
  return (
    <section id="over-ons" className={`section ${styles.about}`}>
      <div className="wrap">
        <h2 className={`script ${styles.titel}`}>About The Woodpecker Diner</h2>
        <p className={styles.copy}>
          Wij begonnen in 2024 aan de Dordtse haven met één idee: het beste van de Amerikaanse
          zuidelijke keuken, gemaakt met wat hier groeit en zwemt. Een diner waar je met z&apos;n
          tweeën aan de bar zit of met tien man aan tafel schuift — dezelfde borden, dezelfde muziek,
          dezelfde te grote portie cornbread.
        </p>
        <p className={`display ${styles.josper}`}>
          Crafted in our Josper oven — charcoal-grilled to perfection
        </p>
        <p className={styles.copy}>
          Alles gaat over de houtskool. Onze Josper stookt op 350 graden en geeft vlees, vis en
          groente die rook die je niet kunt namaken op gas. Wij roken zelf, pekelen zelf en bakken
          elke ochtend brood. De rest doen we met boter.
        </p>
      </div>
    </section>
  )
}
