import React, { useState } from 'react'
import Icoon from '../../components/Icoon.jsx'
import { Leeg, StatusPil } from '../../components/ui.jsx'
import { useStore } from '../../lib/store.jsx'
import { ga, href } from '../../lib/router.js'
import { BRONSOORTEN, bronSoort, datum } from '../../lib/util.js'

const ICOON = { handleiding: 'boek', informatieblad: 'info', werkblad: 'bestand', afbeelding: 'afbeelding', video: 'video', download: 'bestand' }

export default function Bibliotheek({ query }) {
  const { data, acties, kan } = useStore()
  const [soort, setSoort] = useState(query.soort || '')
  const [zoek, setZoek] = useState('')
  const lijst = data.bronnen.filter((b) => (!soort || b.soort === soort) && (!zoek || b.titel.toLowerCase().includes(zoek.toLowerCase())))
  const gebruik = (id) => data.projecten.filter((p) => p.bronIds.includes(id)).length

  return (
    <>
      <div className="paginakop">
        <div><h1>Bibliotheek</h1><p>Handleidingen, informatiebladen en bestanden. Eén keer maken, in elk project koppelen.</p></div>
        {kan('bronnen.beheren') && (
          <div className="knoppen">
            <button className="knop" onClick={() => ga('/docent/bron/' + acties.bronNieuw('handleiding'))}><Icoon naam="plus" maat={18} />Handleiding</button>
            <select id="bib-nieuw" aria-label="Iets anders toevoegen" value="" onChange={(e) => e.target.value && ga('/docent/bron/' + acties.bronNieuw(e.target.value))} style={{ width: 'auto' }}>
              <option value="">Iets anders toevoegen…</option>
              {BRONSOORTEN.filter((s) => s.id !== 'handleiding').map((s) => <option key={s.id} value={s.id}>{s.naam}</option>)}
            </select>
          </div>
        )}
      </div>
      <div className="filters">
        <div className="segment" role="group" aria-label="Soort">
          <button className={!soort ? 'actief' : ''} onClick={() => setSoort('')}>Alles</button>
          {BRONSOORTEN.map((s) => <button key={s.id} className={soort === s.id ? 'actief' : ''} onClick={() => setSoort(s.id)}>{s.meervoud}</button>)}
        </div>
        <input id="bib-zoek" type="search" placeholder="Zoek op titel" value={zoek} onChange={(e) => setZoek(e.target.value)} aria-label="Zoeken" />
      </div>
      {!lijst.length ? <Leeg>Niets gevonden.</Leeg> : (
        <div className="kaart lijst">
          {lijst.map((b) => (
            <div className="rij" key={b.id}>
              <div className="icoonrond blauw"><Icoon naam={ICOON[b.soort]} /></div>
              <div className="groei">
                <a href={href('/docent/bron/' + b.id)}><b>{b.titel}</b></a>
                <small>{bronSoort(b.soort)} · gebruikt in {gebruik(b.id)} project{gebruik(b.id) === 1 ? '' : 'en'} · {datum(b.gewijzigdOp)}</small>
              </div>
              <StatusPil status={b.status} />
              <a className="knop klein licht" href={href('/docent/bron/' + b.id)}><Icoon naam="potlood" maat={15} />Bewerken</a>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
