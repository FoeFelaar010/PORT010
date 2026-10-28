import React, { useState } from 'react'
import { StatusPil, Veld } from '../../components/ui.jsx'
import { useStore } from '../../lib/store.jsx'
import { ga, href } from '../../lib/router.js'
import { datum } from '../../lib/util.js'

const UITLEG = {
  ter_beoordeling: 'Een docent bekijkt uw aanmelding. U hoort binnen twee weken van ons.',
  goedgekeurd: 'Uw aanmelding is goedgekeurd. Een docent werkt het project uit en neemt contact met u op over de planning.',
  afgewezen: 'Uw aanmelding past helaas niet bij PORT. Hieronder staat de reden.',
}

export default function AanmeldingStatus({ code }) {
  const { data } = useStore()
  const [invoer, setInvoer] = useState('')
  const a = code && data.aanmeldingen.find((x) => x.code === code.toUpperCase())
  const p = a?.projectId && data.projecten.find((x) => x.id === a.projectId)

  return (
    <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1>Status van uw aanmelding</h1>
      {!a && (
        <form className="kaart velden" onSubmit={(e) => { e.preventDefault(); ga('/aanmelding/' + invoer.trim().toUpperCase()) }}>
          {code && <p className="fout-tekst">Geen aanmelding gevonden met code {code}.</p>}
          <Veld label="Uw code" uitleg="Zes tekens, bijvoorbeeld KR7P2Q. U kreeg de code na het versturen."><input id="s-code" type="text" value={invoer} onChange={(e) => setInvoer(e.target.value)} /></Veld>
          <div><button className="knop">Bekijken</button></div>
        </form>
      )}
      {a && (
        <div className="kaart" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="kaart-kop"><h2>{a.titel || 'Aanmelding'}</h2><StatusPil status={a.status} /></div>
          <p className="zacht">{a.organisatie} · ingediend op {datum(a.ingediendOp)}</p>
          <p>{UITLEG[a.status]}</p>
          {a.status === 'afgewezen' && a.reden && <div className="tip">{a.reden}</div>}
          {p?.status === 'gepubliceerd' && <p>Het project staat online: <a href={href('/projecten/' + p.slug)}>{p.titel}</a></p>}
        </div>
      )}
    </div>
  )
}
