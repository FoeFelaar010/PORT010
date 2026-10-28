import React, { useState } from 'react'
import Icoon from '../../components/Icoon.jsx'
import { Kruimel, Leeg, StatusPil, Veld } from '../../components/ui.jsx'
import { useStore } from '../../lib/store.jsx'
import { ga, href } from '../../lib/router.js'
import { datum } from '../../lib/util.js'

const FILTERS = [['ter_beoordeling', 'Ter beoordeling'], ['goedgekeurd', 'Goedgekeurd'], ['afgewezen', 'Afgewezen'], ['', 'Alle']]

function Detail({ a }) {
  const { data, acties, kan } = useStore()
  const [afwijzen, setAfwijzen] = useState(false)
  const [reden, setReden] = useState('')
  const mag = kan('aanmeldingen.beoordelen')
  const zet = (k) => (e) => acties.aanmeldingOpslaan({ ...a, [k]: k === 'leerjaar' ? Number(e.target.value) || null : e.target.value })
  const open = a.status === 'ter_beoordeling'
  const p = a.projectId && data.projecten.find((x) => x.id === a.projectId)

  return (
    <>
      <Kruimel items={[['Aanmeldingen', '/docent/aanmeldingen'], [a.titel || a.organisatie]]} />
      <div className="paginakop">
        <div><h1>{a.titel || 'Aanmelding'}</h1><p>{a.organisatie} · ingediend {datum(a.ingediendOp)} · code {a.code}</p></div>
        <StatusPil status={a.status} />
      </div>
      <div className="kolommen">
        <section className="kaart velden">
          <h2>Aanmelding</h2>
          {open && mag && <div className="tip">Je kunt de tekst hier aanpassen voordat je goedkeurt. Bij goedkeuren maak je er een conceptproject van.</div>}
          <Veld label="Titel"><input id="am-titel" type="text" value={a.titel} onChange={zet('titel')} disabled={!open || !mag} /></Veld>
          <Veld label="Vraag van de opdrachtgever"><textarea id="am-vraag" rows={5} value={a.vraag} onChange={zet('vraag')} disabled={!open || !mag} /></Veld>
          <Veld label="Gewenst resultaat"><textarea id="am-res" rows={2} value={a.resultaat} onChange={zet('resultaat')} disabled={!open || !mag} /></Veld>
          <div className="velden twee">
            <Veld label="Klas">
              <select id="am-klas" value={a.leerjaar || ''} onChange={zet('leerjaar')} disabled={!open || !mag}>
                <option value="">Nog niet bepaald</option>{[1, 2, 3, 4].map((k) => <option key={k} value={k}>Klas {k}</option>)}
              </select>
            </Veld>
            <Veld label="Beschikbaarheid"><input id="am-besch" type="text" value={a.beschikbaarheid} onChange={zet('beschikbaarheid')} disabled={!open || !mag} /></Veld>
          </div>
          <Veld label="Interne notitie" uitleg="Alleen zichtbaar voor docenten."><textarea id="am-notitie" rows={2} value={a.notitie} onChange={zet('notitie')} disabled={!mag} /></Veld>
        </section>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <section className="kaart">
            <h3>Contact</h3>
            <p style={{ marginTop: 8 }}><b>{a.contactpersoon}</b><br />{a.organisatie}<br />{a.email}{a.telefoon && <><br />{a.telefoon}</>}</p>
          </section>
          {open && mag && (
            <section className="kaart velden">
              <h3>Beoordelen</h3>
              {!afwijzen ? (
                <div className="knoppen">
                  <button className="knop" onClick={() => ga('/docent/project/' + acties.aanmeldingGoedkeuren(a.id))}><Icoon naam="vink" maat={18} />Goedkeuren</button>
                  <button className="knop gevaar" onClick={() => setAfwijzen(true)}>Afwijzen</button>
                </div>
              ) : (
                <>
                  <Veld label="Reden" uitleg="De opdrachtgever ziet deze tekst bij de status."><textarea id="am-reden" rows={3} value={reden} onChange={(e) => setReden(e.target.value)} autoFocus /></Veld>
                  <div className="knoppen">
                    <button className="knop gevaar" disabled={reden.trim().length < 5} onClick={() => acties.aanmeldingAfwijzen(a.id, reden.trim())}>Afwijzen</button>
                    <button className="knop rand" onClick={() => setAfwijzen(false)}>Annuleren</button>
                  </div>
                </>
              )}
            </section>
          )}
          {a.status === 'goedgekeurd' && (
            <section className="kaart velden">
              <h3>Project</h3>
              {p ? <>
                <p><a href={href('/docent/project/' + p.id)}>{p.titel}</a></p>
                <StatusPil status={p.status} wijzigingen={p.wijzigingen} />
                {p.status === 'gepubliceerd' && kan('projecten.toewijzen') && <a className="knop licht" href={href('/docent/klassen?project=' + p.id)}>Toewijzen aan klas of groep</a>}
              </> : <p className="zacht">Het project is verwijderd.</p>}
            </section>
          )}
          {a.status === 'afgewezen' && <section className="kaart"><h3>Reden afwijzing</h3><p style={{ marginTop: 8 }}>{a.reden}</p></section>}
        </aside>
      </div>
    </>
  )
}

export default function Aanmeldingen({ id }) {
  const { data } = useStore()
  const [status, setStatus] = useState('ter_beoordeling')
  if (id) {
    const a = data.aanmeldingen.find((x) => x.id === id)
    return a ? <Detail a={a} /> : <Leeg>Deze aanmelding bestaat niet (meer).</Leeg>
  }
  const lijst = data.aanmeldingen.filter((a) => !status || a.status === status)
  return (
    <>
      <div className="paginakop"><div><h1>Aanmeldingen</h1><p>Projecten die externe opdrachtgevers hebben aangemeld via het formulier.</p></div></div>
      <div className="segment" role="group" aria-label="Status">
        {FILTERS.map(([w, t]) => (
          <button key={w} className={status === w ? 'actief' : ''} onClick={() => setStatus(w)}>
            {t}{w && ` (${data.aanmeldingen.filter((a) => a.status === w).length})`}
          </button>
        ))}
      </div>
      {!lijst.length ? <Leeg>Geen aanmeldingen met deze status.</Leeg> : (
        <div className="kaart lijst">
          {lijst.map((a) => (
            <div className="rij" key={a.id}>
              <div className="icoonrond oranje"><Icoon naam="gebouw" /></div>
              <div className="groei"><a href={href('/docent/aanmeldingen/' + a.id)}><b>{a.titel || 'Aanmelding'}</b></a><small>{a.organisatie} · {datum(a.ingediendOp)}{a.leerjaar ? ' · klas ' + a.leerjaar : ''}</small></div>
              <StatusPil status={a.status} />
              <a className="knop klein licht" href={href('/docent/aanmeldingen/' + a.id)}>{a.status === 'ter_beoordeling' ? 'Beoordelen' : 'Bekijken'}</a>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
