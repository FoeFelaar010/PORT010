import React from 'react'
import Icoon from '../../components/Icoon.jsx'
import { useBevestig } from '../../components/ui.jsx'
import { useStore } from '../../lib/store.jsx'
import { href } from '../../lib/router.js'

export default function BeheerHome() {
  const { data, acties } = useStore()
  const [bevestig, venster] = useBevestig()
  const tel = (s) => data.projecten.filter((p) => p.status === s).length
  const open = data.aanmeldingen.filter((a) => a.status === 'ter_beoordeling').length

  const tegels = [
    ['projecten', `${tel('gepubliceerd')} gepubliceerd`, `${tel('concept')} concepten · ${tel('gearchiveerd')} gearchiveerd`, '/docent/projecten', 'Projecten beheren'],
    ['inbox', `${open} aanmelding${open === 1 ? '' : 'en'}`, 'Wachten op beoordeling', '/docent/aanmeldingen', 'Beoordelen'],
    ['lijst', 'Lijsten', `${data.vaardigheden.length} vaardigheden · ${data.leerdoelen.length} leerdoelen · ${data.criteria.length} criteria`, '/beheer/lijsten', 'Lijsten beheren'],
    ['slot', 'Rechten', 'Bepaal per rol wat iemand mag', '/beheer/rechten', 'Rechten instellen'],
    ['gebruikers', `${data.docenten.length} docenten`, `${data.opdrachtgevers.length} opdrachtgevers · ${data.klassen.length} klassen`, '/beheer/gebruikers', 'Gebruikers bekijken'],
    ['boek', `${data.bronnen.length} items`, 'Handleidingen, informatiebladen en bestanden', '/docent/bibliotheek', 'Naar de bibliotheek'],
  ]

  return (
    <>
      <div className="paginakop"><div><h1>Beheer</h1><p>Inhoud, lijsten, rechten en gebruikers van PORT010.</p></div></div>
      <div className="raster drie">
        {tegels.map(([icoon, titel, sub, pad, knop]) => (
          <div key={pad} className="kaart tegel">
            <div className="icoonrond"><Icoon naam={icoon} /></div>
            <h3>{titel}</h3>
            <p className="zacht">{sub}</p>
            <a className="linkknop" href={href(pad)} style={{ marginTop: 'auto' }}>{knop} <Icoon naam="pijl" maat={16} /></a>
          </div>
        ))}
      </div>
      <section className="kaart" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h2>Demo</h2>
        <p className="zacht">Dit is fase 1: alles staat in deze browser. In fase 2 komt de database; dan zien alle docenten dezelfde inhoud.</p>
        <div><button className="knop gevaar" onClick={async () => { if (await bevestig('Alle wijzigingen in deze browser wissen en de demo-inhoud terugzetten?', 'Terugzetten', true)) acties.herstelDemo() }}>Demo-inhoud terugzetten</button></div>
      </section>
      {venster}
    </>
  )
}
