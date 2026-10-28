import React from 'react'
import Icoon from './Icoon.jsx'
import { useStore } from '../lib/store.jsx'
import { href } from '../lib/router.js'
import { MOEILIJKHEID, bronSoort } from '../lib/util.js'
import { NIVEAUS } from '../data/demo.js'

export function bronPad(b) {
  if (b.soort === 'handleiding') return '/handleidingen/' + b.slug
  if (b.soort === 'informatieblad') return '/informatiebladen/' + b.slug
  return '/bron/' + b.slug
}

const BRONICOON = { handleiding: 'boek', informatieblad: 'info', werkblad: 'bestand', afbeelding: 'afbeelding', video: 'video', download: 'bestand' }

// De volledige projectpagina. Wordt gebruikt voor bezoekers, leerlingen (met afvinken) en het voorbeeld in de editor.
export default function ProjectWeergave({ p, gedaan, onStap, week, voorbeeld }) {
  const { data } = useStore()
  const cat = data.categorieen.find((c) => c.id === p.categorieId)
  const zoek = (lijst, ids) => ids.map((id) => lijst.find((x) => x.id === id)).filter(Boolean)
  const leerdoelen = zoek(data.leerdoelen, p.leerdoelIds)
  const vaardigheden = zoek(data.vaardigheden, p.vaardigheidIds)
  const bronnen = zoek(data.bronnen, p.bronIds).filter((b) => voorbeeld || b.status === 'gepubliceerd')
  const criteria = zoek(data.criteria, p.criteriumIds)
  const alleStappen = p.deelopdrachten.flatMap((o) => o.stappen)
  const volgende = gedaan ? alleStappen.find((s) => !gedaan.includes(s.id)) : null

  const secties = [
    ['over', 'Over het project', p.introductie || p.probleemstelling || p.hoofdvraag],
    ['doelen', 'Leerdoelen', leerdoelen.length || vaardigheden.length],
    ['opdrachten', 'Opdrachten', p.deelopdrachten.length],
    ['planning', 'Planning', p.planning.length],
    ['materiaal', 'Materiaal en veiligheid', p.materialen.length || p.veiligheid],
    ['bronnen', 'Handleidingen', bronnen.length],
    ['eindproduct', 'Eindproduct', p.eindproduct || p.presentatievorm],
    ['beoordeling', 'Beoordeling', criteria.length || p.reflectievragen.length],
  ].filter((s) => s[2])

  return (
    <article style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <header className={'projectkop kleur-' + (p.kleur || 'paars')}
        style={p.afbeelding ? { backgroundImage: `linear-gradient(90deg, var(--wit) 45%, transparent), url(${p.afbeelding})`, backgroundSize: 'cover', backgroundPosition: 'center' } : null}>
        <div className="chips">
          {cat && <span className="pil label">{cat.naam}</span>}
          {p.opdrachtgever && <span className="pil label">Opdrachtgever: {p.opdrachtgever}</span>}
        </div>
        <h1>{p.titel}</h1>
        {p.samenvatting && <p className="samenvatting">{p.samenvatting}</p>}
        <div className="chips">
          <span className="chip"><Icoon naam="klas" maat={15} />Klas {p.leerjaar}</span>
          <span className="chip"><Icoon naam="kalender" maat={15} />{p.weken} weken</span>
          <span className="chip"><Icoon naam="doel" maat={15} />{MOEILIJKHEID[p.moeilijkheid]}</span>
          {p.versie > 0 && <span className="chip">Versie {p.versie}</span>}
        </div>
      </header>

      {secties.length > 2 && (
        <nav className="sectienav" aria-label="Onderdelen van dit project">
          {secties.map(([id, naam]) => <a key={id} href={'#'} onClick={(e) => { e.preventDefault(); document.getElementById('s-' + id)?.scrollIntoView({ behavior: 'smooth' }) }}>{naam}</a>)}
        </nav>
      )}

      {secties.some((s) => s[0] === 'over') && (
        <section className="sectie kaart" id="s-over">
          <h2>Over het project</h2>
          <div className="leestekst">
            {p.introductie && <p>{p.introductie}</p>}
            {p.probleemstelling && <><h3 style={{ marginTop: 16 }}>Het probleem</h3><p>{p.probleemstelling}</p></>}
          </div>
          {p.hoofdvraag && <p className="hoofdvraag">{p.hoofdvraag}</p>}
        </section>
      )}

      {secties.some((s) => s[0] === 'doelen') && (
        <section className="sectie kaart" id="s-doelen">
          <h2>Wat leer je?</h2>
          {leerdoelen.length > 0 && <ul className="leestekst" style={{ margin: 0, paddingLeft: 20 }}>{leerdoelen.map((l) => <li key={l.id}>{l.naam}</li>)}</ul>}
          {vaardigheden.length > 0 && <div className="chips">{vaardigheden.map((v) => <span key={v.id} className="chip"><Icoon naam="ster" maat={14} />{v.naam}</span>)}</div>}
        </section>
      )}

      {p.deelopdrachten.length > 0 && (
        <section className="sectie" id="s-opdrachten">
          <h2>Opdrachten</h2>
          {p.deelopdrachten.map((o, i) => (
            <div key={o.id} className="deelopdracht">
              <div className="deelopdracht-kop">
                <span className="nr">{i + 1}</span>
                <h3>{o.titel}</h3>
                {o.weekVan ? <span className="chip">Week {o.weekVan}{o.weekTot && o.weekTot !== o.weekVan ? '–' + o.weekTot : ''}</span> : null}
              </div>
              {o.uitleg && <p style={{ padding: '12px 16px 0' }}>{o.uitleg}</p>}
              <ol className="stappen">
                {o.stappen.map((s, j) => {
                  const klaar = gedaan?.includes(s.id)
                  return (
                    <li key={s.id} className={'stap ' + (klaar ? 'klaar ' : '') + (volgende?.id === s.id ? 'volgende' : '')}>
                      {onStap && <input type="checkbox" className="afvink" checked={!!klaar} onChange={() => onStap(s.id)} aria-label={'Stap ' + (i + 1) + '.' + (j + 1) + ' klaar'} />}
                      <span className="snr">{i + 1}.{j + 1}</span>
                      <div className="stekst">
                        <b>{s.titel}</b>
                        {s.instructie && <p>{s.instructie}</p>}
                      </div>
                      {s.minuten ? <small>± {s.minuten} min</small> : null}
                    </li>
                  )
                })}
              </ol>
            </div>
          ))}
        </section>
      )}

      {p.planning.length > 0 && (
        <section className="sectie" id="s-planning">
          <h2>Planning</h2>
          <div className="tabelvak">
            <table>
              <thead><tr><th>Week</th><th>Wat doe je?</th><th>Mijlpaal</th></tr></thead>
              <tbody>
                {p.planning.map((r) => (
                  <tr key={r.week} className={week === r.week ? 'nu' : ''}>
                    <td><b>{r.week}</b>{week === r.week && <span className="zacht"> · nu</span>}</td>
                    <td>{r.onderwerp}</td>
                    <td>{r.mijlpaal ? <span className="pil wijziging">Inleveren of presenteren</span> : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {secties.some((s) => s[0] === 'materiaal') && (
        <section className="sectie kaart" id="s-materiaal">
          <h2>Materiaal en veiligheid</h2>
          {p.materialen.length > 0 && (
            <div className="lijst">
              {p.materialen.map((m, i) => (
                <div className="rij" key={i}>
                  <Icoon naam={m.soort === 'gereedschap' ? 'gereedschap' : 'map'} maat={18} />
                  <span className="groei">{m.naam}</span><small>{m.aantal}</small>
                </div>
              ))}
            </div>
          )}
          {p.veiligheid && <div className="blok-kader veilig"><Icoon naam="schild" /><div><b>Veiligheid</b>{p.veiligheid}</div></div>}
        </section>
      )}

      {bronnen.length > 0 && (
        <section className="sectie" id="s-bronnen">
          <h2>Handleidingen en bronnen</h2>
          <div className="raster drie">
            {bronnen.map((b) => (
              <a key={b.id} className="kaart ingang" href={href(bronPad(b))}>
                <div className="icoonrond"><Icoon naam={BRONICOON[b.soort]} /></div>
                <span className="zacht">{bronSoort(b.soort)}{b.status !== 'gepubliceerd' ? ' · concept' : ''}</span>
                <h3>{b.titel}</h3>
                {b.samenvatting && <p>{b.samenvatting}</p>}
              </a>
            ))}
          </div>
        </section>
      )}

      {secties.some((s) => s[0] === 'eindproduct') && (
        <section className="sectie kaart" id="s-eindproduct">
          <h2>Wat lever je op?</h2>
          {p.eindproduct && <p className="leestekst">{p.eindproduct}</p>}
          {p.presentatievorm && <p className="leestekst"><b>Presentatie:</b> {p.presentatievorm}</p>}
        </section>
      )}

      {secties.some((s) => s[0] === 'beoordeling') && (
        <section className="sectie" id="s-beoordeling">
          <h2>Wanneer is het goed?</h2>
          {criteria.length > 0 && (
            <div className="tabelvak">
              <table>
                <thead><tr><th>Onderdeel</th>{NIVEAUS.map((n) => <th key={n}>{n}</th>)}</tr></thead>
                <tbody>
                  {criteria.map((c) => <tr key={c.id}><td><b>{c.naam}</b></td>{c.niveaus.map((n, i) => <td key={i}>{n}</td>)}</tr>)}
                </tbody>
              </table>
            </div>
          )}
          {p.reflectievragen.length > 0 && (
            <div className="kaart">
              <h3 style={{ marginBottom: 8 }}>Terugkijken</h3>
              <ul style={{ margin: 0, paddingLeft: 20 }}>{p.reflectievragen.map((v, i) => <li key={i}>{v}</li>)}</ul>
            </div>
          )}
        </section>
      )}
    </article>
  )
}
