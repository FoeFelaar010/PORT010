import React, { useEffect, useState } from 'react'
import Icoon from './Icoon.jsx'
import { Melding, useBevestig } from './ui.jsx'
import { useStore } from '../lib/store.jsx'
import { ROLLEN, rolNaam } from '../lib/rechten.js'
import { ga, href } from '../lib/router.js'

const OPENBAAR_MENU = [
  ['Home', '/'], ['Projecten', '/projecten'], ['Handleidingen', '/handleidingen'],
  ['Informatiebladen', '/informatiebladen'], ['Vaardigheden', '/vaardigheden'],
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

// Demo: wisselen van omgeving onder één knop. Fase 5 vervangt dit door inloggen.
function DemoKnop() {
  const { rol, setRol, acties } = useStore()
  const [open, setOpen] = useState(false)
  const [bevestig, venster] = useBevestig()
  useEffect(() => {
    if (!open) return
    const dicht = (e) => { if (!e.target.closest?.('.demoknop')) setOpen(false) }
    const esc = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('click', dicht)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('click', dicht); document.removeEventListener('keydown', esc) }
  }, [open])
  return (
    <div className="demoknop">
      <button className="demoknop-knop" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen(!open)}>
        <span className="demo-pil">Demo</span>{rolNaam(rol)}<Icoon naam="omlaag" maat={16} />
      </button>
      {open && (
        <div className="demopaneel" role="menu">
          <p className="zacht">Bekijk de portal als:</p>
          {ROLLEN.map((r) => (
            <button key={r.id} role="menuitemradio" aria-checked={r.id === rol} className={r.id === rol ? 'actief' : ''}
              onClick={() => { setRol(r.id); setOpen(false); ga(r.start) }}>
              {r.naam}{r.id === rol && <Icoon naam="vink" maat={16} />}
            </button>
          ))}
          <hr />
          <p className="zacht">Fictieve gegevens, geen inlog. Wijzigingen blijven alleen in deze browser.</p>
          <button onClick={async () => {
            setOpen(false)
            if (await bevestig('Alle wijzigingen in deze browser wissen en de demo-inhoud terugzetten?', 'Terugzetten', true)) acties.herstelDemo()
          }}>Demo terugzetten</button>
        </div>
      )}
      {venster}
    </div>
  )
}

function Bovenbalk({ pad }) {
  const { rol } = useStore()
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
            <nav className={'hoofdmenu ' + (open ? 'open' : '')} aria-label="Hoofdmenu" onClick={() => setOpen(false)}>
              {OPENBAAR_MENU.map(([t, p]) => <a key={p} href={href(p)} className={actief(p) ? 'actief' : ''}>{t}</a>)}
            </nav>
          </>
        )}
        <div className="balk-rechts">
          {rol === 'bezoeker' && <a className="knop klein aanmeldknop" href={href('/aanmelden')}>Project aanmelden</a>}
          <DemoKnop />
          {rol === 'bezoeker' && <button className="menuknop" onClick={() => setOpen(!open)} aria-expanded={open}>Menu</button>}
        </div>
      </div>
    </header>
  )
}

function Voet() {
  return (
    <footer className="voet">
      <div className="voet-in">
        <span>PORT: praktijkgericht onderwijs op Melanchthon Mavo Schiebroek</span>
        <span className="rechts">Demoversie: fictieve gegevens, alleen bewaard in deze browser</span>
      </div>
    </footer>
  )
}

export function OpenbaarLayout({ pad, children }) {
  return (
    <>
      <Bovenbalk pad={pad} />
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
      <Voet />
      <Melding />
    </>
  )
}
