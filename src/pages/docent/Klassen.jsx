import React, { useState } from 'react'
import Icoon from '../../components/Icoon.jsx'
import { Kruimel, Leeg, Veld, Voortgang } from '../../components/ui.jsx'
import { useStore } from '../../lib/store.jsx'
import { useRoute, href } from '../../lib/router.js'
import { datum, projectWeek } from '../../lib/util.js'
import { voortgangVan } from '../leerling/mijn.js'

function doelNaam(data, t) {
  if (t.doelType === 'klas') return 'Klas ' + data.klassen.find((k) => k.id === t.doelId)?.naam
  if (t.doelType === 'groep') {
    const g = data.groepen.find((x) => x.id === t.doelId)
    return g ? g.naam + ' (' + data.klassen.find((k) => k.id === g.klasId)?.naam + ')' : 'Groep'
  }
  return data.leerlingen.find((l) => l.id === t.doelId)?.naam || 'Leerling'
}

function Toewijzen({ startProject }) {
  const { data, acties } = useStore()
  const live = data.projecten.filter((p) => p.status === 'gepubliceerd')
  const [f, setF] = useState({ projectId: startProject || live[0]?.id || '', doelType: 'klas', doelId: '', startDatum: new Date().toISOString().slice(0, 10) })
  const opties = f.doelType === 'klas' ? data.klassen.map((k) => ({ id: k.id, naam: 'Klas ' + k.naam }))
    : f.doelType === 'groep' ? data.groepen.map((g) => ({ id: g.id, naam: g.naam + ' (' + data.klassen.find((k) => k.id === g.klasId)?.naam + ')' }))
      : data.leerlingen.map((l) => ({ id: l.id, naam: l.naam + ' (' + data.klassen.find((k) => k.id === l.klasId)?.naam + ')' }))
  return (
    <form className="kaart velden" onSubmit={(e) => { e.preventDefault(); if (f.projectId && f.doelId) { acties.toewijzen(f); setF({ ...f, doelId: '' }) } }}>
      <h2>Project toewijzen</h2>
      {!live.length ? <Leeg>Publiceer eerst een project.</Leeg> : <>
        <Veld label="Project">
          <select id="tw-project" value={f.projectId} onChange={(e) => setF({ ...f, projectId: e.target.value })}>
            {live.map((p) => <option key={p.id} value={p.id}>{p.titel} (klas {p.leerjaar})</option>)}
          </select>
        </Veld>
        <div className="velden twee">
          <Veld label="Aan">
            <select id="tw-type" value={f.doelType} onChange={(e) => setF({ ...f, doelType: e.target.value, doelId: '' })}>
              <option value="klas">Een klas</option><option value="groep">Een groep</option><option value="leerling">Eén leerling</option>
            </select>
          </Veld>
          <Veld label={f.doelType === 'klas' ? 'Klas' : f.doelType === 'groep' ? 'Groep' : 'Leerling'}>
            <select id="tw-doel" value={f.doelId} onChange={(e) => setF({ ...f, doelId: e.target.value })}>
              <option value="">Kies…</option>{opties.map((o) => <option key={o.id} value={o.id}>{o.naam}</option>)}
            </select>
          </Veld>
        </div>
        <Veld label="Startdatum" uitleg="Week 1 van de planning begint op deze datum."><input id="tw-start" type="date" value={f.startDatum} onChange={(e) => setF({ ...f, startDatum: e.target.value })} /></Veld>
        <div><button className="knop" disabled={!f.doelId}>Toewijzen</button></div>
      </>}
    </form>
  )
}

function KlasDetail({ klas }) {
  const { data } = useStore()
  const ll = data.leerlingen.filter((l) => l.klasId === klas.id)
  const tw = data.toewijzingen.filter((t) => t.doelType === 'klas' && t.doelId === klas.id)
  const p = tw[0] && data.projecten.find((x) => x.id === tw[0].projectId)?.live
  const groepen = data.groepen.filter((g) => g.klasId === klas.id)
  return (
    <>
      <Kruimel items={[['Klassen', '/docent/klassen'], ['Klas ' + klas.naam]]} />
      <div className="paginakop"><div><h1>Klas {klas.naam}</h1><p>{p ? `Werkt aan ${p.titel} · week ${Math.min(projectWeek(tw[0].startDatum) || 0, p.weken)} van ${p.weken}` : 'Nog geen project toegewezen.'}</p></div></div>
      {!ll.length ? <Leeg>In de demo staan voor deze klas geen leerlingen. Leerlingen komen later uit Zermelo (na akkoord ICT/FG).</Leeg> : (
        <div className="tabelvak">
          <table>
            <thead><tr><th>Leerling</th><th>Groep</th><th style={{ width: '40%' }}>Voortgang{p ? ' ' + p.titel : ''}</th></tr></thead>
            <tbody>
              {ll.map((l) => {
                const v = p ? voortgangVan(data, l.id, p) : 0
                return (
                  <tr key={l.id}>
                    <td><b>{l.naam}</b></td>
                    <td>{groepen.find((g) => g.leerlingIds.includes(l.id))?.naam || '–'}</td>
                    <td>{p ? <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><div style={{ flex: 1 }}><Voortgang waarde={v} /></div><small>{v}%</small></div> : '–'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default function Klassen({ klasId }) {
  const { data, acties, kan } = useStore()
  const { query } = useRoute()
  if (klasId) {
    const k = data.klassen.find((x) => x.id === klasId)
    return k ? <KlasDetail klas={k} /> : <Leeg>Deze klas bestaat niet.</Leeg>
  }
  return (
    <>
      <div className="paginakop"><div><h1>Klassen</h1><p>Wijs projecten toe en volg de voortgang per klas.</p></div></div>
      <div className="kolommen">
        <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="raster drie">
            {data.klassen.map((k) => {
              const t = data.toewijzingen.find((x) => x.doelType === 'klas' && x.doelId === k.id)
              const p = t && data.projecten.find((x) => x.id === t.projectId)
              return (
                <a key={k.id} className="kaart tegel" href={href('/docent/klassen/' + k.id)} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <span className="getal">{k.naam}</span>
                  <small className="zacht">{k.aantal} leerlingen</small>
                  <span>{p ? p.titel : <span className="zacht">Geen project</span>}</span>
                </a>
              )
            })}
          </div>
          <section className="kaart">
            <h2>Toewijzingen</h2>
            <div className="lijst" style={{ marginTop: 8 }}>
              {!data.toewijzingen.length && <p className="zacht">Nog niets toegewezen.</p>}
              {data.toewijzingen.map((t) => (
                <div className="rij" key={t.id}>
                  <Icoon naam="klas" maat={18} />
                  <div className="groei"><b>{data.projecten.find((p) => p.id === t.projectId)?.titel}</b><small>{doelNaam(data, t)} · start {datum(t.startDatum)}</small></div>
                  {kan('projecten.toewijzen') && <button className="mini" aria-label="Toewijzing weghalen" title="Toewijzing weghalen" onClick={() => acties.toewijzingVerwijderen(t.id)}><Icoon naam="kruis" maat={16} /></button>}
                </div>
              ))}
            </div>
          </section>
        </section>
        {kan('projecten.toewijzen') && <Toewijzen startProject={query.project} />}
      </div>
    </>
  )
}
