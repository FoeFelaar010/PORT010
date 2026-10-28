import React, { useState } from 'react'
import Icoon from '../../components/Icoon.jsx'
import { Leeg } from '../../components/ui.jsx'
import { bronPad } from '../../components/ProjectWeergave.jsx'
import { useStore, liveBronnen } from '../../lib/store.jsx'
import { href } from '../../lib/router.js'

const TEKST = {
  handleiding: ['Handleidingen', 'Stap-voor-stap uitleg voor gereedschap, programma\'s en technieken.', 'boek', 'blauw'],
  informatieblad: ['Informatiebladen', 'Achtergrond en extra uitleg bij je project.', 'info', 'groen'],
}

export default function Bronnen({ soort }) {
  const { data } = useStore()
  const [cat, setCat] = useState('')
  const [titel, uitleg, icoon, kleur] = TEKST[soort]
  const lijst = liveBronnen(data).filter((b) => b.soort === soort && (!cat || b.categorieId === cat))
  const gebruikt = (id) => data.projecten.filter((p) => p.status === 'gepubliceerd' && p.live?.bronIds.includes(id)).length
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="paginakop"><div><h1>{titel}</h1><p>{uitleg}</p></div></div>
      <div className="segment" role="group" aria-label="Categorie">
        <button className={!cat ? 'actief' : ''} onClick={() => setCat('')}>Alles</button>
        {data.categorieen.map((c) => <button key={c.id} className={cat === c.id ? 'actief' : ''} onClick={() => setCat(c.id)}>{c.naam}</button>)}
      </div>
      {lijst.length ? (
        <div className="raster">
          {lijst.map((b) => (
            <a key={b.id} className="kaart ingang" href={href(bronPad(b))}>
              <div className={'icoonrond ' + kleur}><Icoon naam={icoon} /></div>
              <h3>{b.titel}</h3>
              <p>{b.samenvatting}</p>
              {gebruikt(b.id) > 0 && <small className="zacht">Gebruikt in {gebruikt(b.id)} project{gebruikt(b.id) > 1 ? 'en' : ''}</small>}
            </a>
          ))}
        </div>
      ) : <Leeg>Nog niets in deze categorie.</Leeg>}
    </div>
  )
}
