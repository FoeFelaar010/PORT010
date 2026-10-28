import React, { useState } from 'react'
import Icoon from '../../components/Icoon.jsx'
import { Veld } from '../../components/ui.jsx'
import { useStore } from '../../lib/store.jsx'
import { href } from '../../lib/router.js'

const STAPPEN = ['Over u', 'Uw vraag', 'Versturen']

export default function Aanmelden({ alsOpdrachtgever }) {
  const { data, ik, acties, kan } = useStore()
  const og = alsOpdrachtgever ? data.opdrachtgevers.find((o) => o.id === ik.opdrachtgever) : null
  const [stap, setStap] = useState(0)
  const [fout, setFout] = useState('')
  const [code, setCode] = useState(null)
  const [f, setF] = useState({
    organisatie: og?.organisatie || '', contactpersoon: og?.contactpersoon || '', email: og?.email || '', telefoon: '',
    titel: '', vraag: '', resultaat: '', leerjaar: '', beschikbaarheid: '', akkoord: false, website: '',
  })
  const zet = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  if (!kan('project.aanmelden')) return <div className="kaart">In deze rol kun je geen project aanmelden.</div>

  if (code) return (
    <div className="kaart" style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="icoonrond groen"><Icoon naam="vink" /></div>
      <h1>Bedankt voor uw aanmelding</h1>
      <p>Een docent bekijkt uw aanmelding en neemt contact met u op. Met deze code ziet u steeds de status:</p>
      <span className="statuscode">{code}</span>
      <p className="zacht">Bewaar de code of de link hieronder. U heeft geen account nodig.</p>
      <div className="knoppen">
        <a className="knop" href={href('/aanmelding/' + code)}>Status bekijken</a>
        {alsOpdrachtgever && <a className="knop rand" href={href('/opdrachtgever')}>Naar mijn overzicht</a>}
      </div>
    </div>
  )

  const controleer = () => {
    if (stap === 0 && (!f.organisatie.trim() || !f.contactpersoon.trim() || !/^\S+@\S+\.\S+$/.test(f.email))) return 'Vul uw organisatie, naam en een geldig e-mailadres in.'
    if (stap === 1 && f.vraag.trim().length < 20) return 'Beschrijf uw vraag in minstens een paar zinnen.'
    if (stap === 2 && !f.akkoord) return 'Geef toestemming om contact met u op te nemen.'
    return ''
  }
  const verder = (e) => {
    e.preventDefault()
    const melding = controleer()
    setFout(melding)
    if (melding) return
    if (stap < 2) return setStap(stap + 1)
    if (f.website) return // verborgen veld: ingevuld door een spambot
    const { akkoord, website, ...rest } = f
    setCode(acties.aanmeldingIndienen({ ...rest, leerjaar: Number(rest.leerjaar) || null, opdrachtgeverId: og?.id || null }))
  }

  return (
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="paginakop">
        <div>
          <h1>Project aanmelden</h1>
          <p>Heeft uw organisatie een vraagstuk waar leerlingen van 12 tot 16 jaar aan kunnen werken? Vertel het ons.</p>
        </div>
        <span className="pil concept">Stap {stap + 1} van 3</span>
      </div>
      <div className="segment" aria-hidden="true">
        {STAPPEN.map((s, i) => <button key={s} type="button" tabIndex={-1} className={i === stap ? 'actief' : ''}>{i + 1}. {s}</button>)}
      </div>
      <form className="kaart velden" onSubmit={verder} noValidate>
        {stap === 0 && <>
          <Veld label="Naam organisatie"><input id="a-org" type="text" value={f.organisatie} onChange={zet('organisatie')} /></Veld>
          <div className="velden twee">
            <Veld label="Uw naam"><input id="a-naam" type="text" value={f.contactpersoon} onChange={zet('contactpersoon')} /></Veld>
            <Veld label="E-mailadres"><input id="a-email" type="email" value={f.email} onChange={zet('email')} /></Veld>
          </div>
          <Veld label="Telefoonnummer (optioneel)"><input id="a-tel" type="tel" value={f.telefoon} onChange={zet('telefoon')} /></Veld>
        </>}
        {stap === 1 && <>
          <Veld label="Korte titel (optioneel)" uitleg="Bijvoorbeeld: Opbergsysteem voor onze winkel"><input id="a-titel" type="text" value={f.titel} onChange={zet('titel')} /></Veld>
          <Veld label="Wat is het probleem of de vraag?" uitleg="Wat gaat er nu mis, en voor wie?"><textarea id="a-vraag" rows={5} value={f.vraag} onChange={zet('vraag')} /></Veld>
          <Veld label="Wat zou een goed resultaat zijn? (optioneel)" uitleg="Bijvoorbeeld een ontwerp, maquette, prototype of advies."><textarea id="a-res" rows={3} value={f.resultaat} onChange={zet('resultaat')} /></Veld>
          <Veld label="Voor welke klas lijkt het u geschikt? (optioneel)">
            <select id="a-klas" value={f.leerjaar} onChange={zet('leerjaar')}>
              <option value="">Weet ik niet</option>{[1, 2, 3, 4].map((k) => <option key={k} value={k}>Klas {k}</option>)}
            </select>
          </Veld>
        </>}
        {stap === 2 && <>
          <Veld label="Wanneer bent u beschikbaar voor een bezoek of presentatie? (optioneel)"><input id="a-besch" type="text" value={f.beschikbaarheid} onChange={zet('beschikbaarheid')} /></Veld>
          <div className="tip">
            <b>{f.titel || 'Uw aanmelding'}</b> van {f.organisatie}<br />
            <span className="zacht">{f.vraag.slice(0, 160)}{f.vraag.length > 160 ? '…' : ''}</span>
          </div>
          <label className="vinkje"><input id="a-akkoord" type="checkbox" checked={f.akkoord} onChange={zet('akkoord')} />
            <span>Een docent van Melanchthon Mavo Schiebroek mag contact met mij opnemen over deze aanmelding. Mijn gegevens worden alleen daarvoor gebruikt.</span></label>
        </>}
        <input type="text" name="website" value={f.website} onChange={zet('website')} tabIndex={-1} autoComplete="off" aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }} />
        {fout && <p className="fout-tekst" role="alert">{fout}</p>}
        <div className="knoppen">
          {stap > 0 && <button type="button" className="knop rand" onClick={() => { setFout(''); setStap(stap - 1) }}>Vorige</button>}
          <button type="submit" className="knop">{stap < 2 ? 'Volgende' : <><Icoon naam="verzend" maat={16} />Aanmelding versturen</>}</button>
        </div>
      </form>
      {!alsOpdrachtgever && <p className="zacht">Al aangemeld? <a href={href('/aanmelding')}>Bekijk de status met uw code</a>.</p>}
    </div>
  )
}
