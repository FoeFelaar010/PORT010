import React, { useState } from 'react'
import Icoon from '../../components/Icoon.jsx'
import Upload from '../../components/Upload.jsx'
import BronWeergave, { BLOKTYPEN } from '../../components/BronWeergave.jsx'
import { bronPad } from '../../components/ProjectWeergave.jsx'
import { Kruimel, Leeg, StatusPil, Veld, useBevestig } from '../../components/ui.jsx'
import { useStore } from '../../lib/store.jsx'
import { ga, href } from '../../lib/router.js'
import { BRONSOORTEN, datum, heeftTekst, uid } from '../../lib/util.js'

const UITLEG = {
  tekst: 'Gewone tekst. Een lege regel maakt een nieuwe alinea.',
  stappen: 'Eén stap per regel. Ze worden automatisch genummerd.',
  afbeelding: 'De tekst wordt het bijschrift.',
}

export default function BronEditor({ id }) {
  const { data, acties, kan } = useStore()
  const [bevestig, venster] = useBevestig()
  const [voorbeeld, setVoorbeeld] = useState(false)
  const b = data.bronnen.find((x) => x.id === id)
  if (!kan('bronnen.beheren')) return <Leeg>Je hebt geen recht om de bibliotheek te bewerken.</Leeg>
  if (!b) return <Leeg>Dit item bestaat niet (meer). <a href={href('/docent/bibliotheek')}>Naar de bibliotheek</a></Leeg>

  const zet = (veld, waarde) => acties.bronOpslaan({ ...b, [veld]: waarde })
  const zetBlok = (k, nieuw) => zet('blokken', b.blokken.map((x, j) => (j === k ? { ...x, ...nieuw } : x)))
  const verplaats = (k, r) => {
    const j = k + r
    if (j < 0 || j >= b.blokken.length) return
    const n = [...b.blokken];[n[k], n[j]] = [n[j], n[k]]
    zet('blokken', n)
  }
  const projecten = data.projecten.filter((p) => p.bronIds.includes(b.id))

  return (
    <>
      <Kruimel items={[['Bibliotheek', '/docent/bibliotheek'], [b.titel]]} />
      <div className="editor-balk">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h1>{b.titel}</h1>
          <span className="chips"><StatusPil status={b.status} /><span className="opgeslagen"><Icoon naam="vink" maat={14} /> Automatisch opgeslagen · {datum(b.gewijzigdOp)}</span></span>
        </div>
        <div className="knoppen">
          <button className="knop rand" onClick={() => setVoorbeeld(!voorbeeld)}><Icoon naam="oog" maat={18} />{voorbeeld ? 'Bewerken' : 'Voorbeeld'}</button>
          {kan('bronnen.publiceren') && b.status !== 'gepubliceerd' && <button className="knop" onClick={() => { zet('status', 'gepubliceerd'); }}>Publiceren</button>}
          {kan('bronnen.publiceren') && b.status === 'gepubliceerd' && <button className="knop rand" onClick={() => zet('status', 'concept')}>Terug naar concept</button>}
          {b.status === 'gepubliceerd' && b.slug && <a className="knop licht" href={href(bronPad(b))}>Op de website</a>}
        </div>
      </div>

      {voorbeeld ? <><h2>{b.titel}</h2><BronWeergave bron={b} /></> : (
        <div className="kolommen">
          <section className="kaart velden">
            <Veld label="Titel"><input id="be-titel" type="text" value={b.titel} onChange={(e) => zet('titel', e.target.value)} /></Veld>
            <Veld label="Korte omschrijving"><textarea id="be-sam" rows={2} value={b.samenvatting} onChange={(e) => zet('samenvatting', e.target.value)} /></Veld>

            {heeftTekst(b.soort) && (
              <div className="veld">
                <span>Inhoud</span>
                {!b.blokken.length && <Leeg>Nog leeg. Voeg hieronder een blok toe: tekst, een tussenkop, stappen, een tip of een afbeelding.</Leeg>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {b.blokken.map((blok, k) => (
                    <div key={blok.id} className="blokrij">
                      <select aria-label="Soort blok" value={blok.type} onChange={(e) => zetBlok(k, { type: e.target.value })}>
                        {BLOKTYPEN.map(([w, t]) => <option key={w} value={w}>{t}</option>)}
                      </select>
                      <div className="velden" style={{ gap: 6 }}>
                        {blok.type === 'kop'
                          ? <input type="text" aria-label="Tussenkop" value={blok.tekst} onChange={(e) => zetBlok(k, { tekst: e.target.value })} />
                          : <textarea aria-label="Tekst" rows={blok.type === 'stappen' ? 4 : 3} value={blok.tekst} onChange={(e) => zetBlok(k, { tekst: e.target.value })} />}
                        {blok.type === 'afbeelding' && (
                          <div className="knoppen">
                            <Upload accept="image/*" tekst={blok.bestand ? 'Andere afbeelding' : 'Afbeelding kiezen'} onBestand={(d) => zetBlok(k, { bestand: d })} />
                            {blok.bestand && <img src={blok.bestand} alt="" style={{ maxHeight: 80, borderRadius: 6 }} />}
                          </div>
                        )}
                        {UITLEG[blok.type] && <small className="zacht">{UITLEG[blok.type]}</small>}
                      </div>
                      <div className="acties">
                        <button className="mini" aria-label="Omhoog" disabled={k === 0} onClick={() => verplaats(k, -1)}><Icoon naam="omhoog" maat={16} /></button>
                        <button className="mini" aria-label="Omlaag" disabled={k === b.blokken.length - 1} onClick={() => verplaats(k, 1)}><Icoon naam="omlaag" maat={16} /></button>
                        <button className="mini" aria-label="Blok weghalen" onClick={() => zet('blokken', b.blokken.filter((_, j) => j !== k))}><Icoon naam="kruis" maat={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="knoppen">
                  {BLOKTYPEN.map(([w, t]) => (
                    <button key={w} className="knop klein rand" onClick={() => zet('blokken', [...b.blokken, { id: uid('k'), type: w, tekst: '' }])}><Icoon naam="plus" maat={14} />{t}</button>
                  ))}
                </div>
              </div>
            )}

            {b.soort === 'video' && <Veld label="Link naar de video" uitleg="Bijvoorbeeld YouTube of Microsoft Stream."><input id="be-url" type="url" value={b.url} onChange={(e) => zet('url', e.target.value)} /></Veld>}

            {(b.soort === 'afbeelding' || b.soort === 'download' || b.soort === 'werkblad') && (
              <div className="veld">
                <span>{b.soort === 'afbeelding' ? 'Afbeelding' : 'Bestand'}</span>
                <div className="knoppen">
                  <Upload accept={b.soort === 'afbeelding' ? 'image/*' : undefined} tekst={b.bestand ? 'Ander bestand' : 'Bestand kiezen'}
                    onBestand={(d, naam) => acties.bronOpslaan({ ...b, bestand: d, bestandNaam: naam })} />
                  {b.bestandNaam && <span className="zacht">{b.bestandNaam}</span>}
                </div>
              </div>
            )}
          </section>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <section className="kaart velden">
              <Veld label="Soort">
                <select id="be-soort" value={b.soort} onChange={(e) => zet('soort', e.target.value)}>
                  {BRONSOORTEN.map((s) => <option key={s.id} value={s.id}>{s.naam}</option>)}
                </select>
              </Veld>
              <Veld label="Categorie">
                <select id="be-cat" value={b.categorieId} onChange={(e) => zet('categorieId', e.target.value)}>
                  <option value="">Geen</option>{data.categorieen.map((c) => <option key={c.id} value={c.id}>{c.naam}</option>)}
                </select>
              </Veld>
            </section>
            <section className="kaart">
              <h3>Gebruikt in</h3>
              {projecten.length ? <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>{projecten.map((p) => <li key={p.id}><a href={href('/docent/project/' + p.id)}>{p.titel}</a></li>)}</ul>
                : <p className="zacht" style={{ marginTop: 8 }}>Nog niet gekoppeld aan een project.</p>}
            </section>
            <button className="knop gevaar klein" style={{ alignSelf: 'flex-start' }} onClick={async () => {
              const tekst = projecten.length ? `Dit item is gekoppeld aan ${projecten.length} project(en). Verwijderen haalt het daar ook weg. Doorgaan?` : 'Dit item definitief verwijderen?'
              if (await bevestig(tekst, 'Verwijderen', true)) { acties.bronVerwijderen(b.id); ga('/docent/bibliotheek') }
            }}><Icoon naam="prullenbak" maat={16} />Verwijderen</button>
          </aside>
        </div>
      )}
      {venster}
    </>
  )
}
