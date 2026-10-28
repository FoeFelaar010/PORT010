import React from 'react'
import Icoon from './Icoon.jsx'

const KADER = {
  tip: ['Tip', 'info'],
  letop: ['Let op', 'info'],
  veilig: ['Veiligheid', 'schild'],
}

// Toont de inhoudsblokken van een handleiding, informatieblad of werkblad.
export function Blokken({ blokken }) {
  return (
    <div className="blokken">
      {blokken.map((b) => {
        if (b.type === 'kop') return <h2 key={b.id}>{b.tekst}</h2>
        if (b.type === 'stappen') return (
          <ol key={b.id} className="bstappen">
            {b.tekst.split('\n').filter((r) => r.trim()).map((r, i) => <li key={i}><span>{r}</span></li>)}
          </ol>
        )
        if (KADER[b.type]) return (
          <div key={b.id} className={'blok-kader ' + b.type}>
            <Icoon naam={KADER[b.type][1]} />
            <div><b>{KADER[b.type][0]}</b>{b.tekst}</div>
          </div>
        )
        if (b.type === 'afbeelding') return (
          <figure key={b.id}>
            {b.bestand ? <img src={b.bestand} alt={b.tekst || ''} /> : <div className="leeg">Afbeelding volgt</div>}
            {b.tekst && <figcaption>{b.tekst}</figcaption>}
          </figure>
        )
        return <p key={b.id} style={{ whiteSpace: 'pre-line' }}>{b.tekst}</p>
      })}
    </div>
  )
}

export const BLOKTYPEN = [
  ['tekst', 'Tekst'], ['kop', 'Tussenkop'], ['stappen', 'Genummerde stappen'],
  ['tip', 'Tip'], ['letop', 'Let op'], ['veilig', 'Veiligheid'], ['afbeelding', 'Afbeelding'],
]

export default function BronWeergave({ bron }) {
  return (
    <div className="kaart" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {bron.samenvatting && <p className="zacht" style={{ fontSize: '1.02rem' }}>{bron.samenvatting}</p>}
      {bron.blokken?.length > 0 && <Blokken blokken={bron.blokken} />}
      {bron.soort === 'video' && (bron.url
        ? <a className="knop paars" href={bron.url} target="_blank" rel="noreferrer"><Icoon naam="video" />Bekijk de video</a>
        : <div className="leeg">De link naar de video volgt nog.</div>)}
      {bron.bestand && bron.soort !== 'afbeelding' && (
        <a className="knop paars" href={bron.bestand} download={bron.bestandNaam || bron.slug}><Icoon naam="bestand" />Download {bron.bestandNaam || 'bestand'}</a>
      )}
      {bron.bestand && bron.soort === 'afbeelding' && <img src={bron.bestand} alt={bron.titel} style={{ borderRadius: 10 }} />}
    </div>
  )
}
