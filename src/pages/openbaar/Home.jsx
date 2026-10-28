import React, { useState } from 'react'
import Icoon from '../../components/Icoon.jsx'
import { ProjectKaart } from '../../components/ui.jsx'
import { useStore, liveProjecten } from '../../lib/store.jsx'
import { ga, href } from '../../lib/router.js'

const INGANGEN = [
  ['projecten', 'Projecten', 'Echte opdrachten waarin je onderzoekt, ontwerpt en maakt.', '/projecten', ''],
  ['ster', 'Vaardigheden', 'Wat je bij PORT leert, van onderzoeken tot presenteren.', '/vaardigheden', 'oranje'],
  ['boek', 'Handleidingen', 'Stap voor stap uitleg en handige tips.', '/handleidingen', 'blauw'],
  ['info', 'Informatiebladen', 'Achtergrond en extra uitleg bij je project.', '/informatiebladen', 'groen'],
]

export default function Home() {
  const { data } = useStore()
  const [zoek, setZoek] = useState('')
  const projecten = liveProjecten(data).slice(0, 4)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <section className="hero">
        <div className="hero-tekst">
          <h1>Leren door te doen</h1>
          <p>Bij PORT werk je aan echte opdrachten, soms voor een echte opdrachtgever. Hier vind je alle projecten, handleidingen en informatie.</p>
          <form className="zoek" role="search" onSubmit={(e) => { e.preventDefault(); ga('/projecten?q=' + encodeURIComponent(zoek)) }}>
            <input id="home-zoek" type="search" placeholder="Zoek een project, bijvoorbeeld 'maquette'" value={zoek} onChange={(e) => setZoek(e.target.value)} aria-label="Zoeken" />
            <button type="submit" aria-label="Zoeken"><Icoon naam="zoek" /></button>
          </form>
        </div>
        <ol className="hero-stappen" aria-label="Zo werk je bij PORT">
          {[['Onderzoeken', 'Wat is het probleem, en voor wie?'], ['Ontwerpen', 'Ideeën schetsen en de beste kiezen'],
            ['Maken en testen', 'Een prototype bouwen en verbeteren'], ['Presenteren', 'Je oplossing laten zien']].map(([t, u], i) => (
            <li key={t}><span className="nr">{i + 1}</span><span><b>{t}</b><small>{u}</small></span></li>
          ))}
        </ol>
      </section>

      <section className="raster drie">
        {INGANGEN.map(([icoon, titel, tekst, pad, kleur]) => (
          <a key={pad} className="kaart ingang" href={href(pad)}>
            <div className={'icoonrond ' + kleur}><Icoon naam={icoon} /></div>
            <h3>{titel}</h3>
            <p>{tekst}</p>
            <span className="linkknop">Bekijk {titel.toLowerCase()} <Icoon naam="pijl" maat={16} /></span>
          </a>
        ))}
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="paginakop">
          <h2>Projecten</h2>
          <a className="linkknop" href={href('/projecten')}>Alle projecten <Icoon naam="pijl" maat={16} /></a>
        </div>
        <div className="raster">{projecten.map((p) => <ProjectKaart key={p.id} p={p} />)}</div>
      </section>

      <section className="kaart" style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="icoonrond oranje"><Icoon naam="gebouw" /></div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <h3>Heeft uw organisatie een vraagstuk?</h3>
          <p className="zacht">Leerlingen werken graag aan echte opdrachten. Meld een project aan; een docent neemt contact met u op.</p>
        </div>
        <a className="knop" href={href('/aanmelden')}>Project aanmelden</a>
      </section>
    </div>
  )
}
