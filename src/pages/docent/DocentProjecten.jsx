import React, { useState } from 'react'
import Icoon from '../../components/Icoon.jsx'
import { Leeg, StatusPil } from '../../components/ui.jsx'
import { useStore } from '../../lib/store.jsx'
import { ga, href } from '../../lib/router.js'
import { datum } from '../../lib/util.js'
import { useProjectActies } from './projectActies.jsx'

const FILTERS = [['', 'Alle'], ['concept', 'Concept'], ['gepubliceerd', 'Gepubliceerd'], ['gearchiveerd', 'Gearchiveerd']]

export default function DocentProjecten() {
  const { data, acties, kan } = useStore()
  const pa = useProjectActies()
  const [status, setStatus] = useState('')
  const [zoek, setZoek] = useState('')
  const lijst = data.projecten
    .filter((p) => (!status || p.status === status) && (!zoek || p.titel.toLowerCase().includes(zoek.toLowerCase())))
    .sort((a, b) => b.gewijzigdOp.localeCompare(a.gewijzigdOp))

  return (
    <>
      <div className="paginakop">
        <div><h1>Projecten</h1><p>Maak, bewerk en publiceer projecten. Bewerken van een gepubliceerd project verandert pas iets voor leerlingen als je opnieuw publiceert.</p></div>
        {kan('project.maken') && <button className="knop" onClick={() => ga('/docent/project/' + acties.projectNieuw())}><Icoon naam="plus" maat={18} />Nieuw project</button>}
      </div>
      <div className="filters">
        <div className="segment" role="group" aria-label="Status">
          {FILTERS.map(([w, t]) => <button key={w} className={status === w ? 'actief' : ''} onClick={() => setStatus(w)}>{t}</button>)}
        </div>
        <input id="dp-zoek" type="search" placeholder="Zoek op titel" value={zoek} onChange={(e) => setZoek(e.target.value)} aria-label="Zoeken" />
      </div>
      {!lijst.length ? <Leeg>Geen projecten gevonden.</Leeg> : (
        <div className="kaart lijst">
          {lijst.map((p) => (
            <div className="rij" key={p.id}>
              <div className={'icoonrond kleur-' + p.kleur}><Icoon naam="gereedschap" /></div>
              <div className="groei">
                <a href={href('/docent/project/' + p.id)}><b>{p.titel}</b></a>
                <small>Klas {p.leerjaar} · {p.versie ? 'versie ' + p.versie + ' · ' : ''}gewijzigd {datum(p.gewijzigdOp)}</small>
              </div>
              <StatusPil status={p.status} wijzigingen={p.wijzigingen} />
              <div className="knoppen">
                <a className="knop klein licht" href={href('/docent/project/' + p.id)}><Icoon naam="potlood" maat={15} />Bewerken</a>
                {p.status === 'gepubliceerd' && <a className="mini" title="Bekijk op de website" aria-label="Bekijk op de website" href={href('/projecten/' + p.live.slug)}><Icoon naam="oog" maat={16} /></a>}
                {kan('project.maken') && <button className="mini" title="Dupliceren" aria-label="Dupliceren" onClick={() => pa.dupliceren(p)}><Icoon naam="kopie" maat={16} /></button>}
                {kan('project.publiceren') && p.status !== 'gearchiveerd' && <button className="mini" title="Archiveren" aria-label="Archiveren" onClick={() => pa.archiveren(p)}><Icoon naam="archief" maat={16} /></button>}
                {kan('project.publiceren') && p.status === 'gearchiveerd' && <button className="knop klein rand" onClick={() => acties.projectTerugzetten(p.id)}>Terugzetten</button>}
                {pa.magVerwijderen(p) && <button className="mini" title="Verwijderen" aria-label="Verwijderen" onClick={() => pa.verwijderen(p)}><Icoon naam="prullenbak" maat={16} /></button>}
              </div>
            </div>
          ))}
        </div>
      )}
      {pa.venster}
    </>
  )
}
