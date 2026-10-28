import React from 'react'
import { Leeg } from '../../components/ui.jsx'
import { useStore } from '../../lib/store.jsx'
import { datum } from '../../lib/util.js'
import { mijnProjecten } from './mijn.js'

export default function LeerlingPlanning() {
  const { data, ik } = useStore()
  const mijn = mijnProjecten(data, ik.leerling)
  return (
    <>
      <div className="paginakop"><div><h1>Planning</h1><p>Wat je per week doet. De huidige week is gemarkeerd.</p></div></div>
      {!mijn.length && <Leeg>Nog geen planning: je hebt nog geen project.</Leeg>}
      {mijn.map(({ p, week, toewijzing }) => (
        <section key={p.id} className="kaart" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="kaart-kop"><h2>{p.titel}</h2><span className="zacht">Gestart op {datum(toewijzing.startDatum)}</span></div>
          <div className="tabelvak">
            <table>
              <thead><tr><th>Week</th><th>Wat doe je?</th><th>Opdracht</th><th></th></tr></thead>
              <tbody>
                {p.planning.map((r) => {
                  const o = p.deelopdrachten.find((d) => d.weekVan <= r.week && r.week <= (d.weekTot || d.weekVan))
                  return (
                    <tr key={r.week} className={week === r.week ? 'nu' : ''}>
                      <td><b>{r.week}</b>{week === r.week && <span className="zacht"> · nu</span>}</td>
                      <td>{r.onderwerp}</td>
                      <td>{o?.titel || ''}</td>
                      <td>{r.mijlpaal ? <span className="pil wijziging">Inleveren of presenteren</span> : ''}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </>
  )
}
