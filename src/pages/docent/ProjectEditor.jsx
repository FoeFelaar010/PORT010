import React, { useState } from 'react'
import Icoon from '../../components/Icoon.jsx'
import ProjectWeergave from '../../components/ProjectWeergave.jsx'
import Upload from '../../components/Upload.jsx'
import { Kruimel, Leeg, StatusPil, Veld } from '../../components/ui.jsx'
import { useStore } from '../../lib/store.jsx'
import { ga, href } from '../../lib/router.js'
import { BRONSOORTEN, MOEILIJKHEID, bronSoort, datum, uid } from '../../lib/util.js'
import { useProjectActies } from './projectActies.jsx'

// Stappen van de editor. "gevuld" bepaalt het vinkje in het stappenmenu; alleen de titel is verplicht.
const STAPPEN = [
  ['basis', 'Basis', (p) => p.titel && p.titel !== 'Nieuw project'],
  ['intro', 'Introductie', (p) => p.introductie || p.hoofdvraag],
  ['doelen', 'Leerdoelen', (p) => p.leerdoelIds.length || p.vaardigheidIds.length],
  ['opdrachten', 'Opdrachten en stappen', (p) => p.deelopdrachten.length],
  ['planning', 'Planning', (p) => p.planning.length],
  ['materiaal', 'Materiaal en veiligheid', (p) => p.materialen.length || p.veiligheid],
  ['bronnen', 'Handleidingen en bronnen', (p) => p.bronIds.length],
  ['eindproduct', 'Eindproduct', (p) => p.eindproduct],
  ['beoordeling', 'Beoordeling', (p) => p.criteriumIds.length],
  ['controle', 'Controleren en publiceren', () => false],
]
const KLEUREN = ['paars', 'oranje', 'blauw', 'groen', 'roze']

function verplaats(lijst, i, r) {
  const j = i + r
  if (j < 0 || j >= lijst.length) return lijst
  const n = [...lijst];[n[i], n[j]] = [n[j], n[i]]
  return n
}

function Vinklijst({ items, gekozen, onChange, leeg }) {
  if (!items.length) return <Leeg>{leeg}</Leeg>
  return (
    <div className="koppel">
      {items.map((x) => (
        <label key={x.id} className="vinkje">
          <input type="checkbox" checked={gekozen.includes(x.id)}
            onChange={(e) => onChange(e.target.checked ? [...gekozen, x.id] : gekozen.filter((y) => y !== x.id))} />
          <span>{x.naam}{x.extra && <small className="zacht"> · {x.extra}</small>}</span>
        </label>
      ))}
    </div>
  )
}

export default function ProjectEditor({ id, stap: startStap }) {
  const { data, acties, kan } = useStore()
  const pa = useProjectActies()
  const [stap, setStap] = useState(STAPPEN.some((s) => s[0] === startStap) ? startStap : 'basis')
  const [voorbeeld, setVoorbeeld] = useState(false)
  const [bronZoek, setBronZoek] = useState('')
  const p = data.projecten.find((x) => x.id === id)

  if (!kan('project.maken')) return <Leeg>Je hebt geen recht om projecten te bewerken.</Leeg>
  if (!p) return <Leeg>Dit project bestaat niet (meer). <a href={href('/docent/projecten')}>Naar projecten</a></Leeg>

  const zet = (veld, waarde) => acties.projectOpslaan({ ...p, [veld]: waarde })
  const tekst = (veld) => ({ value: p[veld] ?? '', onChange: (e) => zet(veld, e.target.value) })
  const getal = (veld) => ({ value: p[veld] ?? '', onChange: (e) => zet(veld, Number(e.target.value) || 0) })
  const i = STAPPEN.findIndex((s) => s[0] === stap)

  // Deelopdrachten en stappen
  const zetOpdracht = (oi, nieuw) => zet('deelopdrachten', p.deelopdrachten.map((o, k) => (k === oi ? { ...o, ...nieuw } : o)))
  const zetStap = (oi, si, nieuw) => zetOpdracht(oi, { stappen: p.deelopdrachten[oi].stappen.map((s, k) => (k === si ? { ...s, ...nieuw } : s)) })

  const inhoud = {
    basis: (
      <div className="velden">
        <Veld label="Titel"><input id="pe-titel" type="text" {...tekst('titel')} /></Veld>
        <Veld label="Korte omschrijving" uitleg="Eén of twee zinnen. Staat op de projectkaart."><textarea id="pe-samenvatting" rows={2} {...tekst('samenvatting')} /></Veld>
        <div className="velden twee">
          <Veld label="Klas (leerjaar)">
            <select id="pe-leerjaar" {...getal('leerjaar')}>{[1, 2, 3, 4].map((k) => <option key={k} value={k}>Klas {k}</option>)}</select>
          </Veld>
          <Veld label="Categorie">
            <select id="pe-cat" {...tekst('categorieId')}><option value="">Kies een categorie</option>{data.categorieen.map((c) => <option key={c.id} value={c.id}>{c.naam}</option>)}</select>
          </Veld>
          <Veld label="Moeilijkheid">
            <select id="pe-moeilijk" {...getal('moeilijkheid')}>{[1, 2, 3].map((k) => <option key={k} value={k}>{MOEILIJKHEID[k]}</option>)}</select>
          </Veld>
          <Veld label="Duur in weken"><input id="pe-weken" type="number" min="1" max="20" {...getal('weken')} /></Veld>
        </div>
        <Veld label="Opdrachtgever (optioneel)" uitleg="Bijvoorbeeld een bedrijf, de gemeente of een afdeling van school."><input id="pe-og" type="text" {...tekst('opdrachtgever')} /></Veld>
        <div className="veld">
          <span>Kleur en afbeelding</span>
          <div className="knoppen">
            {KLEUREN.map((k) => (
              <button key={k} type="button" className={'mini kleur-' + k} aria-label={'Kleur ' + k} aria-pressed={p.kleur === k}
                style={{ width: 34, height: 34, outline: p.kleur === k ? '3px solid var(--navy)' : 'none' }} onClick={() => zet('kleur', k)} />
            ))}
            <Upload accept="image/*" tekst={p.afbeelding ? 'Andere afbeelding' : 'Afbeelding kiezen'} onBestand={(d) => zet('afbeelding', d)} />
            {p.afbeelding && <button type="button" className="knop klein gevaar" onClick={() => zet('afbeelding', '')}>Afbeelding weghalen</button>}
          </div>
          {p.afbeelding && <img src={p.afbeelding} alt="" style={{ maxHeight: 140, borderRadius: 10, alignSelf: 'flex-start' }} />}
        </div>
      </div>
    ),
    intro: (
      <div className="velden">
        <Veld label="Introductie" uitleg="Waar gaat het over? Schrijf voor een leerling van 12–16 jaar (B1)."><textarea id="pe-intro" rows={4} {...tekst('introductie')} /></Veld>
        <Veld label="Probleemstelling" uitleg="Wat gaat er nu mis, en voor wie?"><textarea id="pe-probleem" rows={4} {...tekst('probleemstelling')} /></Veld>
        <Veld label="Hoofdvraag" uitleg="Eén vraag die leerlingen aan het eind kunnen beantwoorden."><input id="pe-hoofdvraag" type="text" {...tekst('hoofdvraag')} /></Veld>
      </div>
    ),
    doelen: (
      <div className="velden twee">
        <div className="veld"><span>Leerdoelen</span>
          <Vinklijst items={data.leerdoelen} gekozen={p.leerdoelIds} onChange={(v) => zet('leerdoelIds', v)} leeg="Nog geen leerdoelen. Een beheerder voegt ze toe bij Lijsten." />
        </div>
        <div className="veld"><span>Vaardigheden</span>
          <Vinklijst items={data.vaardigheden} gekozen={p.vaardigheidIds} onChange={(v) => zet('vaardigheidIds', v)} leeg="Nog geen vaardigheden." />
        </div>
        {kan('lijsten.beheren') && <p className="zacht">Mist er iets? <a href={href('/beheer/lijsten/leerdoelen')}>Lijsten beheren</a></p>}
      </div>
    ),
    opdrachten: (
      <div className="velden">
        {!p.deelopdrachten.length && <Leeg>Nog geen opdrachten. Verdeel het project in een paar deelopdrachten met elk een paar stappen.</Leeg>}
        {p.deelopdrachten.map((o, oi) => (
          <div key={o.id} className="deelopdracht">
            <div className="deelopdracht-kop">
              <span className="nr">{oi + 1}</span>
              <input type="text" aria-label="Titel deelopdracht" value={o.titel} onChange={(e) => zetOpdracht(oi, { titel: e.target.value })} style={{ flex: 1, minWidth: 160 }} />
              <span className="zacht">week</span>
              <input type="number" aria-label="Van week" min="1" value={o.weekVan || ''} onChange={(e) => zetOpdracht(oi, { weekVan: Number(e.target.value) || null })} style={{ width: 70 }} />
              <span className="zacht">t/m</span>
              <input type="number" aria-label="Tot en met week" min="1" value={o.weekTot || ''} onChange={(e) => zetOpdracht(oi, { weekTot: Number(e.target.value) || null })} style={{ width: 70 }} />
              <button className="mini" title="Omhoog" aria-label="Omhoog" disabled={oi === 0} onClick={() => zet('deelopdrachten', verplaats(p.deelopdrachten, oi, -1))}><Icoon naam="omhoog" maat={16} /></button>
              <button className="mini" title="Omlaag" aria-label="Omlaag" disabled={oi === p.deelopdrachten.length - 1} onClick={() => zet('deelopdrachten', verplaats(p.deelopdrachten, oi, 1))}><Icoon naam="omlaag" maat={16} /></button>
              <button className="mini" title="Deelopdracht weghalen" aria-label="Deelopdracht weghalen" onClick={() => zet('deelopdrachten', p.deelopdrachten.filter((_, k) => k !== oi))}><Icoon naam="prullenbak" maat={16} /></button>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <textarea rows={2} placeholder="Korte uitleg bij deze opdracht (optioneel)" aria-label="Uitleg deelopdracht" value={o.uitleg} onChange={(e) => zetOpdracht(oi, { uitleg: e.target.value })} />
            </div>
            {o.stappen.map((s, si) => (
              <div key={s.id} className="stap" style={{ alignItems: 'flex-start' }}>
                <span className="snr">{oi + 1}.{si + 1}</span>
                <div className="stekst velden" style={{ gap: 8 }}>
                  <input type="text" aria-label="Titel stap" placeholder="Wat doet de leerling? (kort)" value={s.titel} onChange={(e) => zetStap(oi, si, { titel: e.target.value })} />
                  <textarea rows={2} aria-label="Instructie" placeholder="Instructie" value={s.instructie} onChange={(e) => zetStap(oi, si, { instructie: e.target.value })} style={{ minHeight: 60 }} />
                  <label className="zacht" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Ongeveer <input type="number" min="0" value={s.minuten || ''} onChange={(e) => zetStap(oi, si, { minuten: Number(e.target.value) || null })} style={{ width: 80 }} /> minuten
                  </label>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <button className="mini" aria-label="Stap omhoog" disabled={si === 0} onClick={() => zetOpdracht(oi, { stappen: verplaats(o.stappen, si, -1) })}><Icoon naam="omhoog" maat={16} /></button>
                  <button className="mini" aria-label="Stap omlaag" disabled={si === o.stappen.length - 1} onClick={() => zetOpdracht(oi, { stappen: verplaats(o.stappen, si, 1) })}><Icoon naam="omlaag" maat={16} /></button>
                  <button className="mini" aria-label="Stap weghalen" onClick={() => zetOpdracht(oi, { stappen: o.stappen.filter((_, k) => k !== si) })}><Icoon naam="kruis" maat={16} /></button>
                </div>
              </div>
            ))}
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--rand)' }}>
              <button className="linkknop" onClick={() => zetOpdracht(oi, { stappen: [...o.stappen, { id: uid('s'), titel: '', instructie: '', minuten: null }] })}><Icoon naam="plus" maat={16} />Stap toevoegen</button>
            </div>
          </div>
        ))}
        <div><button className="knop licht" onClick={() => zet('deelopdrachten', [...p.deelopdrachten, { id: uid('o'), titel: 'Deelopdracht ' + (p.deelopdrachten.length + 1), uitleg: '', weekVan: null, weekTot: null, stappen: [] }])}><Icoon naam="plus" maat={18} />Deelopdracht toevoegen</button></div>
      </div>
    ),
    planning: (
      <div className="velden">
        {!p.planning.length && (
          <div className="tip" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ flex: 1 }}>Begin met een lege regel per week ({p.weken} weken).</span>
            <button className="knop klein" onClick={() => zet('planning', Array.from({ length: p.weken }, (_, k) => ({ week: k + 1, onderwerp: '', mijlpaal: false })))}>Maak {p.weken} weken</button>
          </div>
        )}
        {p.planning.length > 0 && (
          <div className="tabelvak">
            <table>
              <thead><tr><th>Week</th><th>Wat doen leerlingen?</th><th className="midden">Mijlpaal</th><th></th></tr></thead>
              <tbody>
                {p.planning.map((r, k) => {
                  const zetRij = (nieuw) => zet('planning', p.planning.map((x, j) => (j === k ? { ...x, ...nieuw } : x)))
                  return (
                    <tr key={k}>
                      <td><input type="number" min="1" aria-label="Week" value={r.week} onChange={(e) => zetRij({ week: Number(e.target.value) || 1 })} style={{ width: 70 }} /></td>
                      <td><input type="text" aria-label="Onderwerp" value={r.onderwerp} onChange={(e) => zetRij({ onderwerp: e.target.value })} /></td>
                      <td className="midden"><input type="checkbox" aria-label="Mijlpaal" checked={r.mijlpaal} onChange={(e) => zetRij({ mijlpaal: e.target.checked })} style={{ width: 18, height: 18 }} /></td>
                      <td><button className="mini" aria-label="Regel weghalen" onClick={() => zet('planning', p.planning.filter((_, j) => j !== k))}><Icoon naam="kruis" maat={16} /></button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {p.planning.length > 0 && <div><button className="linkknop" onClick={() => zet('planning', [...p.planning, { week: (p.planning.at(-1)?.week || 0) + 1, onderwerp: '', mijlpaal: false }])}><Icoon naam="plus" maat={16} />Week toevoegen</button></div>}
        <p className="zacht">Een mijlpaal is een moment waarop leerlingen iets inleveren of presenteren.</p>
      </div>
    ),
    materiaal: (
      <div className="velden">
        <div className="veld"><span>Materialen en gereedschap</span>
          {p.materialen.map((m, k) => {
            const zetM = (nieuw) => zet('materialen', p.materialen.map((x, j) => (j === k ? { ...x, ...nieuw } : x)))
            return (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr) minmax(0,1fr) auto', gap: 8 }}>
                <input type="text" aria-label="Naam" placeholder="Naam" value={m.naam} onChange={(e) => zetM({ naam: e.target.value })} />
                <select aria-label="Soort" value={m.soort} onChange={(e) => zetM({ soort: e.target.value })}><option value="materiaal">Materiaal</option><option value="gereedschap">Gereedschap</option></select>
                <input type="text" aria-label="Aantal" placeholder="Aantal" value={m.aantal} onChange={(e) => zetM({ aantal: e.target.value })} />
                <button className="mini" aria-label="Weghalen" onClick={() => zet('materialen', p.materialen.filter((_, j) => j !== k))}><Icoon naam="kruis" maat={16} /></button>
              </div>
            )
          })}
          <div><button className="linkknop" onClick={() => zet('materialen', [...p.materialen, { naam: '', soort: 'materiaal', aantal: '' }])}><Icoon naam="plus" maat={16} />Toevoegen</button></div>
        </div>
        <Veld label="Veiligheid" uitleg="Wat moeten leerlingen weten voordat ze beginnen?"><textarea id="pe-veilig" rows={3} {...tekst('veiligheid')} /></Veld>
      </div>
    ),
    bronnen: (() => {
      const z = bronZoek.toLowerCase()
      const items = data.bronnen.filter((b) => !z || b.titel.toLowerCase().includes(z))
        .map((b) => ({ id: b.id, naam: b.titel, extra: bronSoort(b.soort) + (b.status !== 'gepubliceerd' ? ' · concept' : '') }))
      return (
        <div className="velden">
          <div className="tip">Koppel bestaande handleidingen en bestanden. Ze worden niet gekopieerd: pas je een handleiding aan, dan zie je dat in elk project waar hij aan hangt.</div>
          <input type="search" aria-label="Zoek in de bibliotheek" placeholder="Zoek in de bibliotheek" value={bronZoek} onChange={(e) => setBronZoek(e.target.value)} />
          <Vinklijst items={items} gekozen={p.bronIds} onChange={(v) => zet('bronIds', v)} leeg="Niets gevonden." />
          {kan('bronnen.beheren') && (
            <div className="knoppen">
              <span className="zacht">Nieuw in de bibliotheek:</span>
              {BRONSOORTEN.map((s) => (
                <button key={s.id} className="knop klein rand" onClick={() => {
                  const bid = acties.bronNieuw(s.id)
                  zet('bronIds', [...p.bronIds, bid])
                  ga('/docent/bron/' + bid)
                }}>{s.naam}</button>
              ))}
            </div>
          )}
        </div>
      )
    })(),
    eindproduct: (
      <div className="velden">
        <Veld label="Wat leveren leerlingen op?" uitleg="Bijvoorbeeld een maquette, prototype, poster of verslag."><textarea id="pe-eind" rows={3} {...tekst('eindproduct')} /></Veld>
        <Veld label="Hoe presenteren ze het?"><input id="pe-pres" type="text" {...tekst('presentatievorm')} /></Veld>
      </div>
    ),
    beoordeling: (
      <div className="velden">
        <div className="veld"><span>Beoordelingscriteria</span>
          <Vinklijst items={data.criteria} gekozen={p.criteriumIds} onChange={(v) => zet('criteriumIds', v)} leeg="Nog geen criteria. Een beheerder voegt ze toe bij Lijsten." />
          <small className="zacht">Elk criterium heeft vier niveaus. Die staan bij Beheer → Lijsten → Criteria.</small>
        </div>
        <div className="veld"><span>Reflectievragen</span>
          {p.reflectievragen.map((v, k) => (
            <div key={k} style={{ display: 'flex', gap: 8 }}>
              <input type="text" aria-label={'Reflectievraag ' + (k + 1)} value={v} onChange={(e) => zet('reflectievragen', p.reflectievragen.map((x, j) => (j === k ? e.target.value : x)))} />
              <button className="mini" aria-label="Weghalen" onClick={() => zet('reflectievragen', p.reflectievragen.filter((_, j) => j !== k))}><Icoon naam="kruis" maat={16} /></button>
            </div>
          ))}
          <div><button className="linkknop" onClick={() => zet('reflectievragen', [...p.reflectievragen, ''])}><Icoon naam="plus" maat={16} />Vraag toevoegen</button></div>
        </div>
      </div>
    ),
    controle: (
      <div className="velden">
        <div className="lijst">
          {STAPPEN.slice(0, -1).map(([sid, naam, gevuld]) => (
            <div className="rij" key={sid}>
              <span className={'icoonrond ' + (gevuld(p) ? 'groen' : '')} style={{ width: 30, height: 30, borderRadius: 8 }}><Icoon naam={gevuld(p) ? 'vink' : 'potlood'} maat={16} /></span>
              <span className="groei">{naam}</span>
              {!gevuld(p) && <button className="linkknop" onClick={() => setStap(sid)}>Invullen</button>}
            </div>
          ))}
        </div>
        <p className="zacht">Niet alles hoeft ingevuld te zijn. Lege onderdelen zie je niet op de projectpagina.</p>
        <div className="knoppen">
          <button className="knop rand" onClick={() => setVoorbeeld(true)}><Icoon naam="oog" maat={18} />Voorbeeld bekijken</button>
          {kan('project.publiceren') && p.status !== 'gearchiveerd' && (p.status !== 'gepubliceerd' || p.wijzigingen) &&
            <button className="knop" onClick={() => pa.publiceren(p)}>{p.live ? `Versie ${p.versie + 1} publiceren` : 'Publiceren'}</button>}
        </div>
        {!kan('project.publiceren') && <p className="zacht">Je mag zelf niet publiceren. Een collega met publicatierecht kan dit project publiceren.</p>}
      </div>
    ),
  }

  const toewijzingen = data.toewijzingen.filter((t) => t.projectId === p.id)

  return (
    <>
      <Kruimel items={[['Projecten', '/docent/projecten'], [p.titel]]} />
      <div className="editor-balk">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h1>{p.titel}</h1>
          <span className="chips"><StatusPil status={p.status} wijzigingen={p.wijzigingen} />
            <span className="opgeslagen"><Icoon naam="vink" maat={14} /> Automatisch opgeslagen · {datum(p.gewijzigdOp)}{p.versie ? ` · live: versie ${p.versie}` : ''}</span></span>
        </div>
        <div className="knoppen">
          <button className="knop rand" onClick={() => setVoorbeeld(true)}><Icoon naam="oog" maat={18} />Voorbeeld</button>
          {kan('project.publiceren') && p.status !== 'gearchiveerd' && (p.status !== 'gepubliceerd' || p.wijzigingen) &&
            <button className="knop" onClick={() => pa.publiceren(p)}>Publiceren…</button>}
          {p.status === 'gepubliceerd' && kan('projecten.toewijzen') && <a className="knop licht" href={href('/docent/klassen?project=' + p.id)}>Toewijzen</a>}
        </div>
      </div>

      <div className="editor">
        <nav className="editor-stappen" aria-label="Onderdelen">
          {STAPPEN.map(([sid, naam, gevuld], k) => (
            <button key={sid} className={(stap === sid ? 'actief ' : '') + (gevuld(p) ? 'gevuld' : '')} onClick={() => setStap(sid)}>
              <span className="bol">{gevuld(p) && stap !== sid ? <Icoon naam="vink" maat={13} /> : k + 1}</span>{naam}
            </button>
          ))}
        </nav>
        <section className="kaart" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <h2>{STAPPEN[i][1]}</h2>
          {inhoud[stap]}
          <div className="knoppen" style={{ justifyContent: 'space-between', borderTop: '1px solid var(--rand)', paddingTop: 14 }}>
            {i > 0 ? <button className="knop rand" onClick={() => setStap(STAPPEN[i - 1][0])}>Vorige</button> : <span />}
            {i < STAPPEN.length - 1 && <button className="knop paars" onClick={() => setStap(STAPPEN[i + 1][0])}>Volgende: {STAPPEN[i + 1][1]}</button>}
          </div>
        </section>
      </div>

      <section className="kaart" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h3>Meer acties</h3>
        {toewijzingen.length > 0 && <p className="zacht">Toegewezen aan: {toewijzingen.map((t) => (data.klassen.find((k) => k.id === t.doelId) || data.groepen.find((g) => g.id === t.doelId) || data.leerlingen.find((l) => l.id === t.doelId))?.naam).join(', ')}</p>}
        {p.aanmeldingId && <p className="zacht">Komt uit een aanmelding: <a href={href('/docent/aanmeldingen/' + p.aanmeldingId)}>bekijk de aanmelding</a></p>}
        <div className="knoppen">
          <button className="knop rand klein" onClick={() => pa.dupliceren(p)}><Icoon naam="kopie" maat={16} />Dupliceren</button>
          {kan('project.publiceren') && p.status !== 'gearchiveerd' && <button className="knop rand klein" onClick={() => pa.archiveren(p)}><Icoon naam="archief" maat={16} />Archiveren</button>}
          {kan('project.publiceren') && p.status === 'gearchiveerd' && <button className="knop rand klein" onClick={() => acties.projectTerugzetten(p.id)}>Terugzetten</button>}
          {pa.magVerwijderen(p) && <button className="knop gevaar klein" onClick={() => pa.verwijderen(p, () => ga('/docent/projecten'))}><Icoon naam="prullenbak" maat={16} />Verwijderen</button>}
        </div>
      </section>

      {voorbeeld && (
        <div className="venster-achter" onClick={() => setVoorbeeld(false)}>
          <div className="venster breed" role="dialog" aria-modal="true" aria-label="Voorbeeld" onClick={(e) => e.stopPropagation()}>
            <div className="voorbeeldbalk">
              <b>Voorbeeld: zo ziet een leerling dit project{p.wijzigingen || !p.live ? ' na publiceren' : ''}</b>
              <button className="knop klein paars" onClick={() => setVoorbeeld(false)} autoFocus>Sluiten</button>
            </div>
            <ProjectWeergave p={p} voorbeeld />
          </div>
        </div>
      )}
      {pa.venster}
    </>
  )
}
