import React from 'react'
import { href } from '../../lib/router.js'

const STAPPEN = [
  ['U meldt een project aan', 'Beschrijf in het formulier welk probleem of welke vraag uw organisatie heeft. Dat kost ongeveer vijf minuten.'],
  ['Een docent beoordeelt de aanmelding', 'Past de vraag bij leerlingen van 12 tot 16 jaar? Binnen twee weken hoort u of het project doorgaat.'],
  ['De docent maakt er een project van', 'Met stappen, planning en beoordeling. Soms vragen we u om een kort bezoek of een interview aan het begin.'],
  ['Leerlingen gaan aan de slag', 'Een klas of groep werkt zes tot negen weken aan uw vraag.'],
  ['Eindpresentatie', 'De leerlingen presenteren hun ontwerp of prototype aan u, op school of bij u op locatie.'],
]

export default function OpdrachtgeverUitleg() {
  return (
    <>
      <div className="paginakop"><div><h1>Hoe werkt het?</h1><p>Van aanmelding tot eindpresentatie.</p></div></div>
      <ol className="kaart" style={{ listStyle: 'none', margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {STAPPEN.map(([t, u], i) => (
          <li key={t} style={{ display: 'flex', gap: 14 }}>
            <span className="icoonrond oranje" style={{ fontFamily: 'var(--f-kop)', fontWeight: 700 }}>{i + 1}</span>
            <div><h3>{t}</h3><p className="zacht">{u}</p></div>
          </li>
        ))}
      </ol>
      <div><a className="knop" href={href('/opdrachtgever/aanmelden')}>Project aanmelden</a></div>
    </>
  )
}
