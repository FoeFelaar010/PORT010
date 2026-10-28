import React, { useState } from 'react'
import Icoon from '../../components/Icoon.jsx'
import { Leeg, useBevestig } from '../../components/ui.jsx'
import { useStore } from '../../lib/store.jsx'
import { ga } from '../../lib/router.js'
import { NIVEAUS } from '../../data/demo.js'

const LIJSTEN = [
  ['vaardigheden', 'Vaardigheden', 'vaardigheidIds', { naam: '', omschrijving: '' }],
  ['leerdoelen', 'Leerdoelen', 'leerdoelIds', { naam: '' }],
  ['categorieen', 'Categorieën', 'categorieId', { naam: '', kleur: 'paars' }],
  ['criteria', 'Criteria', 'criteriumIds', { naam: '', vaardigheidId: '', niveaus: ['', '', '', ''] }],
  ['klassen', 'Klassen', null, { naam: '', leerjaar: 1, aantal: 0 }],
]
const KLEUREN = ['paars', 'oranje', 'blauw', 'groen', 'roze']

function Item({ lijst, item, gebruik, index, aantal }) {
  const { data, acties } = useStore()
  const [bevestig, venster] = useBevestig()
  const zet = (veld, w) => acties.lijstOpslaan(lijst, { ...item, [veld]: w })
  return (
    <div className="kaart" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 14 }}>
      <div className="velden" style={{ flex: 1, gap: 8, minWidth: 0 }}>
        <input type="text" aria-label="Naam" value={item.naam} onChange={(e) => zet('naam', e.target.value)} />
        {lijst === 'vaardigheden' && <textarea rows={2} aria-label="Omschrijving" value={item.omschrijving} onChange={(e) => zet('omschrijving', e.target.value)} style={{ minHeight: 56 }} />}
        {lijst === 'categorieen' && (
          <select aria-label="Kleur" value={item.kleur} onChange={(e) => zet('kleur', e.target.value)} style={{ width: 'auto' }}>
            {KLEUREN.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        )}
        {lijst === 'klassen' && (
          <div className="velden twee">
            <label className="veld"><span>Leerjaar</span><input type="number" min="1" max="4" value={item.leerjaar} onChange={(e) => zet('leerjaar', Number(e.target.value) || 1)} /></label>
            <label className="veld"><span>Aantal leerlingen</span><input type="number" min="0" value={item.aantal} onChange={(e) => zet('aantal', Number(e.target.value) || 0)} /></label>
          </div>
        )}
        {lijst === 'criteria' && (
          <>
            <select aria-label="Hoort bij vaardigheid" value={item.vaardigheidId} onChange={(e) => zet('vaardigheidId', e.target.value)}>
              <option value="">Geen vaardigheid</option>{data.vaardigheden.map((v) => <option key={v.id} value={v.id}>{v.naam}</option>)}
            </select>
            <div className="velden twee">
              {NIVEAUS.map((n, k) => (
                <label key={n} className="veld"><span>{n}</span>
                  <textarea rows={2} value={item.niveaus[k]} style={{ minHeight: 56 }} onChange={(e) => zet('niveaus', item.niveaus.map((x, j) => (j === k ? e.target.value : x)))} />
                </label>
              ))}
            </div>
          </>
        )}
        {gebruik > 0 && <small className="zacht">Gebruikt in {gebruik} project{gebruik === 1 ? '' : 'en'}</small>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <button className="mini" aria-label="Omhoog" disabled={index === 0} onClick={() => acties.lijstVerplaats(lijst, item.id, -1)}><Icoon naam="omhoog" maat={16} /></button>
        <button className="mini" aria-label="Omlaag" disabled={index === aantal - 1} onClick={() => acties.lijstVerplaats(lijst, item.id, 1)}><Icoon naam="omlaag" maat={16} /></button>
        <button className="mini" aria-label="Verwijderen" onClick={async () => {
          if (gebruik > 0) return bevestig(`Dit wordt nog gebruikt in ${gebruik} project(en). Haal het daar eerst weg.`, 'Begrepen')
          if (await bevestig(`"${item.naam || 'Zonder naam'}" verwijderen?`, 'Verwijderen', true)) acties.lijstVerwijderen(lijst, item.id)
        }}><Icoon naam="prullenbak" maat={16} /></button>
      </div>
      {venster}
    </div>
  )
}

export default function Lijsten({ lijst = 'vaardigheden' }) {
  const { data, acties, kan } = useStore()
  const def = LIJSTEN.find((l) => l[0] === lijst) || LIJSTEN[0]
  const [naam, titel, veld, leeg] = def
  if (!kan('lijsten.beheren')) return <Leeg>Je hebt geen recht om lijsten te beheren.</Leeg>

  const gebruik = (id) => {
    if (def[0] === 'klassen') return data.toewijzingen.filter((t) => t.doelId === id).length + data.leerlingen.filter((l) => l.klasId === id).length
    if (def[0] === 'categorieen') return data.projecten.filter((p) => p.categorieId === id).length + data.bronnen.filter((b) => b.categorieId === id).length
    return data.projecten.filter((p) => p[veld].includes(id)).length
  }
  return (
    <>
      <div className="paginakop"><div><h1>Lijsten</h1><p>Vaste keuzes die docenten in de projecteditor gebruiken.</p></div></div>
      <div className="segment" role="tablist" aria-label="Lijst">
        {LIJSTEN.map(([n, t]) => <button key={n} role="tab" aria-selected={n === naam} className={n === naam ? 'actief' : ''} onClick={() => ga('/beheer/lijsten/' + n)}>{t}</button>)}
      </div>
      <div className="paginakop">
        <h2>{titel}</h2>
        <button className="knop" onClick={() => acties.lijstNieuw(naam, { ...leeg, naam: 'Nieuw' })}><Icoon naam="plus" maat={18} />Toevoegen</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data[naam].map((item, k) => <Item key={item.id} lijst={naam} item={item} gebruik={gebruik(item.id)} index={k} aantal={data[naam].length} />)}
      </div>
    </>
  )
}
