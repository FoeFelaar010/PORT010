import React, { useState } from 'react'
import { Leeg, ProjectKaart } from '../../components/ui.jsx'
import { useStore, liveProjecten } from '../../lib/store.jsx'

export default function Projecten({ query }) {
  const { data } = useStore()
  const [zoek, setZoek] = useState(query.q || '')
  const [klas, setKlas] = useState('')
  const [cat, setCat] = useState('')
  const z = zoek.toLowerCase()
  const lijst = liveProjecten(data).filter((p) =>
    (!klas || String(p.leerjaar) === klas) && (!cat || p.categorieId === cat) &&
    (!z || (p.titel + ' ' + p.samenvatting + ' ' + p.hoofdvraag).toLowerCase().includes(z)))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="paginakop">
        <div><h1>Projecten</h1><p>Alle gepubliceerde PORT-projecten.</p></div>
      </div>
      <div className="filters">
        <input id="p-zoek" type="search" placeholder="Zoeken" value={zoek} onChange={(e) => setZoek(e.target.value)} aria-label="Zoeken" />
        <select id="p-klas" value={klas} onChange={(e) => setKlas(e.target.value)} aria-label="Klas">
          <option value="">Alle klassen</option>{[1, 2, 3, 4].map((k) => <option key={k} value={k}>Klas {k}</option>)}
        </select>
        <select id="p-cat" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Categorie">
          <option value="">Alle categorieën</option>{data.categorieen.map((c) => <option key={c.id} value={c.id}>{c.naam}</option>)}
        </select>
      </div>
      {lijst.length ? <div className="raster">{lijst.map((p) => <ProjectKaart key={p.id} p={p} />)}</div>
        : <Leeg>Geen projecten gevonden. Probeer een ander woord of haal een filter weg.</Leeg>}
    </div>
  )
}
