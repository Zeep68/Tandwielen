'use client'

import { useEffect, useState } from 'react'
import { MENU_DATA, type MenuType, type MenuItem } from '@/data/menu'
import styles from './MenuSection.module.css'

const TABS: MenuType[] = ['lunch', 'diner', 'drinks']

function isMenuType(value: string): value is MenuType {
  return (TABS as string[]).includes(value)
}

export default function MenuSection() {
  const [actief, setActief] = useState<MenuType>('lunch')

  useEffect(() => {
    const syncMetHash = () => {
      const hash = window.location.hash.slice(1)
      if (isMenuType(hash)) setActief(hash)
    }
    syncMetHash()
    window.addEventListener('hashchange', syncMetHash)
    return () => window.removeEventListener('hashchange', syncMetHash)
  }, [])

  const kaart = MENU_DATA[actief]
  const categorieen = groepeer(kaart.items)

  return (
    <section id="menu" className={`section ${styles.menu}`}>
      <div className="wrap">
        <div className={styles.tabs} role="tablist" aria-label="Menukaarten">
          {TABS.map((tab) => (
            <button
              key={tab}
              role="tab"
              id={tab}
              aria-selected={actief === tab}
              aria-controls={`paneel-${tab}`}
              className={`display ${styles.tab} ${actief === tab ? styles[tab] : ''}`}
              onClick={() => setActief(tab)}
            >
              {MENU_DATA[tab].titel}
            </button>
          ))}
        </div>

        <div
          key={actief}
          id={`paneel-${actief}`}
          role="tabpanel"
          aria-labelledby={actief}
          className={styles.paneel}
        >
          <h2 className={`script ${styles.titel} ${styles[`kleur_${actief}`]}`}>{kaart.titel}</h2>
          <p className={styles.intro}>{kaart.intro}</p>

          {categorieen.map(([categorie, items]) => (
            <div key={categorie} className={styles.groep}>
              {categorie && <h3 className={`display ${styles.categorie}`}>{categorie}</h3>}
              <ul className={styles.grid}>
                {items.map((item) => (
                  <li key={item.naam} className={styles.item}>
                    <div className={styles.regel}>
                      <span className={`display ${styles.naam}`}>
                        {item.naam}
                        {(item.veg || item.vegOptie) && (
                          <span
                            className={styles.veg}
                            style={{ opacity: item.veg ? 1 : 0.55 }}
                            title={item.veg ? 'Vegetarisch' : 'Vegetarische optie'}
                            aria-label={item.veg ? 'Vegetarisch' : 'Vegetarische optie'}
                          >
                            {' '}🌿
                          </span>
                        )}
                      </span>
                      <span className={styles.stippellijn} aria-hidden="true" />
                      <span className={styles.prijs}>{formatPrijs(item.prijs)}</span>
                    </div>
                    <p className={styles.beschrijving}>{item.beschrijving}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <p className={styles.voetnoot}>
            🌿 vegetarisch · doorzichtig blaadje = vegetarisch te bestellen. Allergie of dieetwens?
            Laat het ons weten.
          </p>
        </div>
      </div>
    </section>
  )
}

function groepeer(items: MenuItem[]): [string, MenuItem[]][] {
  const map = new Map<string, MenuItem[]>()
  for (const item of items) {
    const key = item.categorie ?? ''
    map.set(key, [...(map.get(key) ?? []), item])
  }
  return [...map.entries()]
}

function formatPrijs(prijs: number) {
  return `€ ${prijs.toFixed(2).replace('.', ',')}`
}
