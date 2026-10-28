import React from 'react'
import Icoon from '../../components/Icoon.jsx'
import { Leeg, Voortgang } from '../../components/ui.jsx'
import { bronPad } from '../../components/ProjectWeergave.jsx'
import { useStore } from '../../lib/store.jsx'
import { href } from '../../lib/router.js'
import { mijnProjecten } from './mijn.js'

export default function LeerlingHome() {
  const { data, ik } = useStore()
  const ll = data.leerlingen.find((l) => l.id === ik.leerling)
  const mijn = mijnProjecten(data, ik.leerling)
  const hoofd = mijn[0]
  const voornaam = ll?.naam.split(' ')[0]

  return (
    <>
      <div className="paginakop"><div><h1>Hoi {voornaam}!</h1><p>Hier zie je waar je bent en wat je nu gaat doen.</p></div></div>
      {!hoofd && <Leeg>Je hebt nog geen project. Je docent zet het hier klaar.</Leeg>}
      {hoofd && (() => {
        const { p, volgende, procent, week } = hoofd
        const opdracht = p.deelopdrachten.find((o) => o.stappen.some((s) => s.id === volgende?.id))
        const dezeWeek = p.planning.find((r) => r.week === week)
        const handleiding = p.bronIds.map((id) => data.bronnen.find((b) => b.id === id)).find((b) => b?.status === 'gepubliceerd' && b.soort === 'handleiding')
        return (
          <>
            <section className="kaart" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="kaart-kop">
                <div><span className="zacht">Mijn project</span><h2>{p.titel}</h2></div>
                <a className="knop" href={href('/leerling/project/' + p.id)}>{volgende ? 'Ga verder' : 'Bekijk project'} <Icoon naam="pijl" maat={16} /></a>
              </div>
              <Voortgang waarde={procent} />
              <p className="zacht">{procent}% van de stappen klaar{week ? ` · week ${Math.min(week, p.weken)} van ${p.weken}` : ''}</p>
            </section>
            <div className="raster drie">
              <div className="kaart tegel">
                <div className="icoonrond oranje"><Icoon naam="doel" /></div>
                <span className="zacht">Wat doe ik nu?</span>
                {volgende ? <><b>{volgende.titel}</b><p className="zacht">{opdracht?.titel}</p></> : <b>Alle stappen zijn klaar. Goed gedaan!</b>}
              </div>
              <div className="kaart tegel">
                <div className="icoonrond"><Icoon naam="kalender" /></div>
                <span className="zacht">Deze week</span>
                <b>{dezeWeek?.onderwerp || 'Geen planning voor deze week'}</b>
                {dezeWeek?.mijlpaal && <span className="pil wijziging" style={{ alignSelf: 'flex-start' }}>Inleveren of presenteren</span>}
              </div>
              <div className="kaart tegel">
                <div className="icoonrond blauw"><Icoon naam="boek" /></div>
                <span className="zacht">Handleiding</span>
                {handleiding ? <a href={href(bronPad(handleiding))}><b>{handleiding.titel}</b></a> : <b>Geen handleiding gekoppeld</b>}
              </div>
            </div>
            <section className="kaart">
              <h3>Wanneer is het goed genoeg?</h3>
              <p className="zacht" style={{ marginTop: 6 }}>{p.eindproduct ? 'Lever in: ' + p.eindproduct.replace(/\.$/, '') + '.' : ''} Bekijk de beoordeling onderaan je project.</p>
            </section>
          </>
        )
      })()}
      {mijn.length > 1 && (
        <section className="kaart">
          <h3>Andere projecten</h3>
          <div className="lijst">
            {mijn.slice(1).map((m) => <div className="rij" key={m.p.id}><a className="groei" href={href('/leerling/project/' + m.p.id)}><b>{m.p.titel}</b></a><small>{m.procent}%</small></div>)}
          </div>
        </section>
      )}
    </>
  )
}
