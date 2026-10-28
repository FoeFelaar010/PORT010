import React, { useState } from 'react'
import Icoon from './Icoon.jsx'
import { href } from '../lib/router.js'
import { useStore } from '../lib/store.jsx'
import { MOEILIJKHEID } from '../lib/util.js'

const STATUS = {
  concept: 'Concept', ter_beoordeling: 'Ter beoordeling', gepubliceerd: 'Gepubliceerd',
  gearchiveerd: 'Gearchiveerd', afgewezen: 'Afgewezen', goedgekeurd: 'Goedgekeurd',
}

export function StatusPil({ status, wijzigingen }) {
  return (
    <span className="chips">
      <span className={'pil ' + status}>{STATUS[status] || status}</span>
      {wijzigingen && status === 'gepubliceerd' && <span className="pil wijziging">Wijzigingen nog niet gepubliceerd</span>}
    </span>
  )
}

export function Leeg({ children }) {
  return <div className="leeg">{children}</div>
}

export function Veld({ label, uitleg, children }) {
  return (
    <label className="veld">
      <span>{label}</span>
      {children}
      {uitleg && <small>{uitleg}</small>}
    </label>
  )
}

export function Voortgang({ waarde }) {
  return <div className="voortgang" role="progressbar" aria-valuenow={waarde} aria-valuemin="0" aria-valuemax="100"><i style={{ width: waarde + '%' }} /></div>
}

// Bevestigingsvenster in de pagina zelf (geen window.confirm).
export function useBevestig() {
  const [vraag, setVraag] = useState(null)
  const bevestig = (tekst, knop = 'Doorgaan', gevaar = false) =>
    new Promise((ok) => setVraag({ tekst, knop, gevaar, ok }))
  const venster = vraag && (
    <div className="venster-achter" onClick={() => { vraag.ok(false); setVraag(null) }}>
      <div className="venster" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <p>{vraag.tekst}</p>
        <div className="knoppen">
          <button className={'knop ' + (vraag.gevaar ? 'gevaar' : '')} autoFocus onClick={() => { vraag.ok(true); setVraag(null) }}>{vraag.knop}</button>
          <button className="knop rand" onClick={() => { vraag.ok(false); setVraag(null) }}>Annuleren</button>
        </div>
      </div>
    </div>
  )
  return [bevestig, venster]
}

export function ProjectKaart({ p, naar }) {
  const { data } = useStore()
  const cat = data.categorieen.find((c) => c.id === p.categorieId)
  const beeldStijl = p.afbeelding ? { backgroundImage: `url(${p.afbeelding})` } : null
  return (
    <a className="pkaart" href={href(naar || '/projecten/' + p.slug)}>
      <div className={'beeld kleur-' + (p.kleur || 'paars')} style={beeldStijl}>
        {!p.afbeelding && <Icoon naam="gereedschap" maat={40} />}
        {cat && <span className="pil">{cat.naam}</span>}
      </div>
      <div className="tekst">
        <h3>{p.titel}</h3>
        <p>{p.samenvatting}</p>
        <div className="meta"><span>Klas {p.leerjaar}</span><span>{p.weken} weken</span><span>{MOEILIJKHEID[p.moeilijkheid]}</span></div>
      </div>
    </a>
  )
}

export function Melding() {
  const { melding } = useStore()
  if (!melding) return null
  return <div className={'melding ' + (melding.soort === 'fout' ? 'fout' : '')} role="status">{melding.tekst}</div>
}

export function Kruimel({ items }) {
  return (
    <div className="kruimel">
      {items.map(([tekst, pad], i) => (
        <span key={i}>{i > 0 && ' / '}{pad ? <a href={href(pad)}>{tekst}</a> : tekst}</span>
      ))}
    </div>
  )
}
