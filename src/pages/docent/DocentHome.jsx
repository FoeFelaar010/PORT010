import React from 'react'
import Icoon from '../../components/Icoon.jsx'
import { StatusPil, Voortgang } from '../../components/ui.jsx'
import { useStore } from '../../lib/store.jsx'
import { ga, href } from '../../lib/router.js'
import { datum, projectWeek } from '../../lib/util.js'
import { voortgangVan } from '../leerling/mijn.js'

function groet() {
  const u = new Date().getHours()
  return u < 12 ? 'Goedemorgen' : u < 18 ? 'Goedemiddag' : 'Goedenavond'
}

export default function DocentHome() {
  const { data, ik, rol, acties, kan } = useStore()
  const mij = data.docenten.find((d) => d.id === (rol === 'beheerder' ? ik.beheerder : ik.docent))
  const open = data.aanmeldingen.filter((a) => a.status === 'ter_beoordeling')
  const concepten = data.projecten.filter((p) => p.status === 'concept' || p.wijzigingen)
  const recent = [...data.projecten].filter((p) => p.status !== 'gearchiveerd').sort((a, b) => b.gewijzigdOp.localeCompare(a.gewijzigdOp)).slice(0, 5)

  return (
    <>
      <div className="paginakop">
        <div><h1>{groet()}, {mij?.naam}</h1><p>Bovenaan staat wat op jou wacht.</p></div>
        <div className="knoppen">
          {kan('project.maken') && <button className="knop" onClick={() => ga('/docent/project/' + acties.projectNieuw())}><Icoon naam="plus" maat={18} />Nieuw project</button>}
          {kan('bronnen.beheren') && <button className="knop licht" onClick={() => ga('/docent/bron/' + acties.bronNieuw('handleiding'))}>Handleiding toevoegen</button>}
        </div>
      </div>

      {(open.length > 0 || concepten.length > 0) && (
        <section className="kaart">
          <h2>Wacht op jou</h2>
          <div className="lijst">
            {open.map((a) => (
              <div className="rij" key={a.id}>
                <div className="icoonrond oranje"><Icoon naam="inbox" /></div>
                <div className="groei"><b>{a.titel || 'Aanmelding'}</b><small>Aangemeld door {a.organisatie} op {datum(a.ingediendOp)}</small></div>
                <StatusPil status={a.status} />
                <a className="knop klein" href={href('/docent/aanmeldingen/' + a.id)}>Beoordelen</a>
              </div>
            ))}
            {concepten.map((p) => (
              <div className="rij" key={p.id}>
                <div className="icoonrond"><Icoon naam="potlood" /></div>
                <div className="groei"><b>{p.titel}</b><small>Laatst gewijzigd {datum(p.gewijzigdOp)}</small></div>
                <StatusPil status={p.status} wijzigingen={p.wijzigingen} />
                <a className="knop klein licht" href={href('/docent/project/' + p.id)}>Verder bewerken</a>
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="paginakop"><h2>Klassen aan het werk</h2><a className="linkknop" href={href('/docent/klassen')}>Alle klassen <Icoon naam="pijl" maat={16} /></a></div>
        <div className="raster">
          {data.toewijzingen.map((t) => {
            const p = data.projecten.find((x) => x.id === t.projectId)?.live
            const klas = t.doelType === 'klas' ? data.klassen.find((k) => k.id === t.doelId) : null
            if (!p || !klas) return null
            const ll = data.leerlingen.filter((l) => l.klasId === klas.id)
            const gem = ll.length ? Math.round(ll.reduce((s, l) => s + voortgangVan(data, l.id, p), 0) / ll.length) : 0
            return (
              <a key={t.id} className="kaart tegel" href={href('/docent/klassen/' + klas.id)} style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className="getal">{klas.naam}</span>
                <b>{p.titel}</b>
                <Voortgang waarde={gem} />
                <small className="zacht">Gemiddeld {gem}% · week {Math.min(projectWeek(t.startDatum) || 0, p.weken)} van {p.weken}</small>
              </a>
            )
          })}
        </div>
      </section>

      <section className="kaart">
        <div className="kaart-kop"><h2>Laatst bewerkt</h2><a className="linkknop" href={href('/docent/projecten')}>Alle projecten <Icoon naam="pijl" maat={16} /></a></div>
        <div className="lijst">
          {recent.map((p) => (
            <div className="rij" key={p.id}>
              <a className="groei" href={href('/docent/project/' + p.id)}><b>{p.titel}</b></a>
              <small>Klas {p.leerjaar}</small>
              <StatusPil status={p.status} wijzigingen={p.wijzigingen} />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
