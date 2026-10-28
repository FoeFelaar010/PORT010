import React from 'react'
import Icoon from '../../components/Icoon.jsx'
import { Leeg } from '../../components/ui.jsx'
import { useStore } from '../../lib/store.jsx'

export default function Gebruikers() {
  const { data, acties, kan } = useStore()
  if (!kan('gebruikers.beheren')) return <Leeg>Je hebt geen recht om gebruikers te beheren.</Leeg>
  return (
    <>
      <div className="paginakop">
        <div><h1>Gebruikers</h1><p>Fictieve gebruikers. Inloggen en echte accounts volgen in fase 5, na akkoord van ICT/FG.</p></div>
        <button className="knop" onClick={() => acties.lijstNieuw('docenten', { naam: 'Nieuwe docent', email: '', rol: 'docent' })}><Icoon naam="plus" maat={18} />Docent toevoegen</button>
      </div>
      <section className="kaart">
        <h2>Docenten en beheerders</h2>
        <div className="lijst" style={{ marginTop: 8 }}>
          {data.docenten.map((d) => (
            <div className="rij" key={d.id}>
              <input type="text" aria-label="Naam" value={d.naam} onChange={(e) => acties.lijstOpslaan('docenten', { ...d, naam: e.target.value })} style={{ flex: 1, minWidth: 160 }} />
              <input type="email" aria-label="E-mail" placeholder="e-mail" value={d.email} onChange={(e) => acties.lijstOpslaan('docenten', { ...d, email: e.target.value })} style={{ flex: 1, minWidth: 180 }} />
              <select aria-label="Rol" value={d.rol} onChange={(e) => acties.lijstOpslaan('docenten', { ...d, rol: e.target.value })} style={{ width: 'auto' }}>
                <option value="docent">Docent</option><option value="beheerder">Beheerder</option>
              </select>
              <button className="mini" aria-label="Verwijderen" onClick={() => acties.lijstVerwijderen('docenten', d.id)} disabled={d.rol === 'beheerder' && data.docenten.filter((x) => x.rol === 'beheerder').length === 1}><Icoon naam="prullenbak" maat={16} /></button>
            </div>
          ))}
        </div>
      </section>
      <div className="raster twee">
        <section className="kaart">
          <h2>Leerlingen</h2>
          <p className="zacht" style={{ margin: '6px 0 10px' }}>Komen later uit Zermelo. In de demo staan alleen een paar leerlingen in 2B en 3A.</p>
          <div className="lijst">{data.leerlingen.map((l) => <div className="rij" key={l.id}><span className="groei">{l.naam}</span><small>{data.klassen.find((k) => k.id === l.klasId)?.naam}</small></div>)}</div>
        </section>
        <section className="kaart">
          <h2>Opdrachtgevers</h2>
          <p className="zacht" style={{ margin: '6px 0 10px' }}>Krijgen geen account maar volgen hun aanmelding met een statuscode.</p>
          <div className="lijst">{data.opdrachtgevers.map((o) => <div className="rij" key={o.id}><span className="groei"><b>{o.organisatie}</b><small>{o.contactpersoon} · {o.email}</small></span></div>)}</div>
        </section>
      </div>
    </>
  )
}
