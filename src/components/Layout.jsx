import React, { useState } from 'react'
import Icoon from './Icoon.jsx'
import { Melding, useBevestig } from './ui.jsx'
import { useStore } from '../lib/store.jsx'
import { ROLLEN } from '../lib/rechten.js'
import { ga, href } from '../lib/router.js'

const OPENBAAR_MENU = [
  ['Home', '/'], ['Projecten', '/projecten'], ['Handleidingen', '/handleidingen'],
  ['Informatiebladen', '/informatiebladen'], ['Vaardigheden', '/vaardigheden'], ['Project aanmelden', '/aanmelden'],
]

// Zijmenu per omgeving: hooguit zes onderdelen.
export function useMenu(gebied) {
  const { data, ik } = useStore()
  const open = data.aanmeldingen.filter((a) => a.status === 'ter_beoordeling').length
  return {
    leerling: [['home', 'Overzicht', '/leerling'], ['projecten', 'Mijn project', '/leerling/project'],
      ['kalender', 'Planning', '/leerling/planning'], ['boek', 'Handleidingen', '/handleidingen'],
      ['ster', 'Mijn vaardigheden', '/leerling/vaardigheden']],
    docent: [['home', 'Overzicht', '/docent'], ['projecten', 'Projecten', '/docent/projecten'],
      ['inbox', 'Aanmeldingen', '/docent/aanmeldingen', open], ['klas', 'Klassen', '/docent/klassen'],
      ['boek', 'Bibliotheek', '/docent/bibliotheek']],
    beheer: [['home', 'Overzicht', '/beheer'], ['slot', 'Rechten', '/beheer/rechten'],
      ['lijst', 'Lijsten', '/beheer/lijsten'], ['gebruikers', 'Gebruikers', '/beheer/gebruikers'],
      ['projecten', 'Projecten', '/docent/projecten'], ['boek', 'Bibliotheek', '/docent/bibliotheek']],
    opdrachtgever: [['home', 'Overzicht', '/opdrachtgever'], ['plus', 'Project aanmelden', '/opdrachtgever/aanmelden'],
      ['info', 'Hoe werkt het?', '/opdrachtgever/uitleg'], ['projecten', 'Voorbeeldprojecten', '/projecten']],
  }[gebied] || []
}

function Bovenbalk({ pad }) {
  const { rol, setRol } = useStore()
  const [open, setOpen] = useState(false)
  const actief = (p) => (p === '/' ? pad === '/' : pad.startsWith(p))
  return (
    <header className="bovenbalk">
      <div className="bovenbalk-in">
        <a className="merk" href={href('/')} aria-label="PORT010 home">
          <img src="./logo-melanchthon-port.png" alt="Melanchthon Mavo Schiebroek · PORT" />
        </a>
        {rol === 'bezoeker' && (
          <>
            <button className="menuknop" onClick={() => setOpen(!open)} aria-expanded={open}>Menu</button>
            <nav className={'hoofdmenu ' + (open ? 'open' : '')} aria-label="Hoofdmenu" onClick={() => setOpen(false)}>
              {OPENBAAR_MENU.map(([t, p]) => <a key={p} href={href(p)} className={actief(p) ? 'actief' : ''}>{t}</a>)}
            </nav>
          </>
        )}
        <label className="bekijk-als">
          <span>Bekijk als</span>
          <select id="bekijk-als" value={rol} onChange={(e) => {
            const r = e.target.value
            setRol(r)
            ga(ROLLEN.find((x) => x.id === r).start)
          }}>
            {ROLLEN.map((r) => <option key={r.id} value={r.id}>{r.naam}</option>)}
          </select>
        </label>
      </div>
    </header>
  )
}

function DemoBalk() {
  const { acties } = useStore()
  const [bevestig, venster] = useBevestig()
  return (
    <div className="demobalk">
      <div className="demobalk-in">
        <span><b>Demoversie.</b> Fictieve gegevens, geen inlog. Wijzigingen blijven alleen in deze browser.</span>
        <button onClick={async () => {
          if (await bevestig('Alle wijzigingen in deze browser wissen en de demo-inhoud terugzetten?', 'Terugzetten', true)) acties.herstelDemo()
        }}>Demo terugzetten</button>
      </div>
      {venster}
    </div>
  )
}

function Voet() {
  return (
    <footer className="voet">
      <div className="voet-in">
        <img src="./logo-melanchthon-port.png" alt="" />
        <span>PORT: praktijkgericht onderwijs op Melanchthon Mavo Schiebroek</span>
      </div>
    </footer>
  )
}

export function OpenbaarLayout({ pad, children }) {
  return (
    <>
      <Bovenbalk pad={pad} />
      <DemoBalk />
      <main className="pagina">{children}</main>
      <Voet />
      <Melding />
    </>
  )
}

export function AppLayout({ gebied, pad, wie, children }) {
  const menu = useMenu(gebied)
  // Langste overeenkomst wint, zodat /docent niet ook actief is op /docent/projecten.
  const actief = menu.map((m) => m[2]).filter((p) => pad === p || pad.startsWith(p + '/')).sort((a, b) => b.length - a.length)[0]
  return (
    <>
      <Bovenbalk pad={pad} />
      <DemoBalk />
      <div className="app">
        <aside className="zijbalk">
          {wie && <div className="wie"><b>{wie[0]}</b><small>{wie[1]}</small></div>}
          <nav aria-label="Menu">
            {menu.map(([icoon, tekst, p, tel]) => (
              <a key={p} href={href(p)} className={p === actief ? 'actief' : ''}>
                <Icoon naam={icoon} maat={18} />{tekst}{tel ? <span className="tel">{tel}</span> : null}
              </a>
            ))}
          </nav>
        </aside>
        <main className="inhoud">{children}</main>
      </div>
      <Melding />
    </>
  )
}
