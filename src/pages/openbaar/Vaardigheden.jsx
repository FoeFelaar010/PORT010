import React from 'react'
import Icoon from '../../components/Icoon.jsx'
import { useStore, liveProjecten } from '../../lib/store.jsx'
import { href } from '../../lib/router.js'

export default function Vaardigheden() {
  const { data } = useStore()
  const projecten = liveProjecten(data)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="paginakop"><div><h1>Vaardigheden</h1><p>Dit oefen je in de PORT-projecten. Bij elk project staat welke vaardigheden erbij horen.</p></div></div>
      <div className="raster twee">
        {data.vaardigheden.map((v) => {
          const bij = projecten.filter((p) => p.vaardigheidIds.includes(v.id))
          return (
            <div key={v.id} className="kaart" style={{ display: 'flex', gap: 14 }}>
              <div className="icoonrond oranje"><Icoon naam="ster" /></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                <h3>{v.naam}</h3>
                <p className="zacht">{v.omschrijving}</p>
                {bij.length > 0 && <div className="chips">{bij.map((p) => <a key={p.id} className="chip" href={href('/projecten/' + p.slug)}>{p.titel}</a>)}</div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
