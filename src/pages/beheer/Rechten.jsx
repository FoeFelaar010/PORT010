import React from 'react'
import { useStore } from '../../lib/store.jsx'
import { RECHTEN, ROLLEN, VAST } from '../../lib/rechten.js'

export default function Rechten() {
  const { data, acties, kan } = useStore()
  const mag = kan('rechten.beheren')
  return (
    <>
      <div className="paginakop">
        <div><h1>Rechten</h1><p>Vink aan wat elke rol mag. Wijzigingen gelden direct.</p></div>
        {mag && <button className="knop rand" onClick={acties.rechtenStandaard}>Standaard terugzetten</button>}
      </div>
      <div className="tabelvak">
        <table className="matrix">
          <thead><tr><th>Recht</th>{ROLLEN.map((r) => <th key={r.id}>{r.naam}</th>)}</tr></thead>
          <tbody>
            <tr><td>Gepubliceerde projecten en handleidingen bekijken</td>{ROLLEN.map((r) => <td key={r.id}><input type="checkbox" checked disabled aria-label={'Bekijken: ' + r.naam} /></td>)}</tr>
            {RECHTEN.map((recht) => (
              <tr key={recht.code}>
                <td>{recht.naam}</td>
                {ROLLEN.map((r) => {
                  const vast = VAST[r.id]?.includes(recht.code)
                  return (
                    <td key={r.id}>
                      <input type="checkbox" aria-label={recht.naam + ': ' + r.naam} disabled={!mag || vast}
                        checked={(data.matrix[r.id] || []).includes(recht.code)}
                        onChange={(e) => acties.rechtZetten(r.id, recht.code, e.target.checked)} />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="zacht">In deze demo bepalen de rechten welke knoppen je ziet. Na het invoeren van inloggen (fase 5) controleert de database dezelfde rechten, zodat niemand ze kan omzeilen.</p>
    </>
  )
}
