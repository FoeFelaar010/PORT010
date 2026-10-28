import React from 'react'
import Icoon from '../../components/Icoon.jsx'
import { useStore } from '../../lib/store.jsx'
import { mijnProjecten } from './mijn.js'

// Fase 1: laat zien welke vaardigheden je in je projecten oefent. Beoordelen per vaardigheid komt in fase 6.
export default function LeerlingVaardigheden() {
  const { data, ik } = useStore()
  const mijn = mijnProjecten(data, ik.leerling)
  return (
    <>
      <div className="paginakop"><div><h1>Mijn vaardigheden</h1><p>Deze vaardigheden oefen je in je projecten.</p></div></div>
      <div className="raster twee">
        {data.vaardigheden.map((v) => {
          const in_ = mijn.filter((m) => m.p.vaardigheidIds.includes(v.id))
          return (
            <div key={v.id} className="kaart" style={{ display: 'flex', gap: 14, opacity: in_.length ? 1 : .6 }}>
              <div className={'icoonrond ' + (in_.length ? 'oranje' : '')}><Icoon naam="ster" /></div>
              <div style={{ minWidth: 0 }}>
                <h3>{v.naam}</h3>
                <p className="zacht">{v.omschrijving}</p>
                {in_.length > 0 && <p style={{ marginTop: 6, fontSize: '.9rem' }}>Oefen je in: {in_.map((m) => m.p.titel).join(', ')}</p>}
              </div>
            </div>
          )
        })}
      </div>
      <p className="zacht">Later zie je hier ook wat je docent over je vaardigheden zegt.</p>
    </>
  )
}
