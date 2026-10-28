import React from 'react'
import Icoon from '../../components/Icoon.jsx'
import { Leeg, StatusPil } from '../../components/ui.jsx'
import { useStore } from '../../lib/store.jsx'
import { href } from '../../lib/router.js'
import { datum } from '../../lib/util.js'

export default function OpdrachtgeverHome() {
  const { data, ik } = useStore()
  const og = data.opdrachtgevers.find((o) => o.id === ik.opdrachtgever)
  const mijn = data.aanmeldingen.filter((a) => a.opdrachtgeverId === ik.opdrachtgever)
  const tel = (s) => mijn.filter((a) => a.status === s).length

  return (
    <>
      <div className="paginakop">
        <div><h1>Welkom, {og?.organisatie}</h1><p>Bedankt dat u leerlingen aan een echte opdracht laat werken.</p></div>
        <a className="knop" href={href('/opdrachtgever/aanmelden')}><Icoon naam="plus" maat={18} />Project aanmelden</a>
      </div>
      <div className="raster drie">
        <div className="kaart tegel"><span className="getal">{tel('ter_beoordeling')}</span><span className="zacht">Ter beoordeling</span></div>
        <div className="kaart tegel"><span className="getal">{tel('goedgekeurd')}</span><span className="zacht">Goedgekeurd</span></div>
        <div className="kaart tegel"><span className="getal">{tel('afgewezen')}</span><span className="zacht">Afgewezen</span></div>
      </div>
      <section className="kaart">
        <h2>Mijn aanmeldingen</h2>
        {!mijn.length ? <Leeg>U heeft nog niets aangemeld.</Leeg> : (
          <div className="lijst" style={{ marginTop: 8 }}>
            {mijn.map((a) => {
              const p = a.projectId && data.projecten.find((x) => x.id === a.projectId)
              const klassen = p ? data.toewijzingen.filter((t) => t.projectId === p.id).length : 0
              return (
                <div className="rij" key={a.id}>
                  <div className="icoonrond oranje"><Icoon naam="gebouw" /></div>
                  <div className="groei">
                    <b>{a.titel || 'Aanmelding'}</b>
                    <small>Ingediend {datum(a.ingediendOp)}
                      {p?.status === 'gepubliceerd' && <> · project staat online{klassen ? ` · ${klassen} klas${klassen === 1 ? '' : 'sen'} aan het werk` : ''}</>}
                      {a.status === 'afgewezen' && a.reden && <> · {a.reden}</>}
                    </small>
                  </div>
                  <StatusPil status={a.status} />
                  {p?.status === 'gepubliceerd' && <a className="knop klein licht" href={href('/projecten/' + p.live.slug)}>Bekijk project</a>}
                </div>
              )
            })}
          </div>
        )}
      </section>
      <section className="kaart" style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="icoonrond"><Icoon naam="schild" /></div>
        <p style={{ flex: 1, minWidth: 220 }}>U ziet geen leerlingwerk of namen van leerlingen. De docent deelt resultaten met u, bijvoorbeeld tijdens de eindpresentatie.</p>
      </section>
    </>
  )
}
