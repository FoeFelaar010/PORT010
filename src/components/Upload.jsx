import React, { useRef, useState } from 'react'
import Icoon from './Icoon.jsx'

// Fase 1: bestanden worden als data-URL in de browser bewaard, dus klein houden.
// Fase 2: upload naar Supabase Storage; dit onderdeel blijft hetzelfde.
export default function Upload({ accept, maxKB = 800, tekst = 'Bestand kiezen', onBestand }) {
  const ref = useRef(null)
  const [fout, setFout] = useState('')
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 4 }}>
      <input ref={ref} type="file" accept={accept} hidden onChange={(e) => {
        const f = e.target.files?.[0]
        e.target.value = ''
        if (!f) return
        if (f.size > maxKB * 1024) return setFout(`Dit bestand is ${Math.round(f.size / 1024)} kB. In de demo kan maximaal ${maxKB} kB.`)
        setFout('')
        const r = new FileReader()
        r.onload = () => onBestand(r.result, f.name)
        r.readAsDataURL(f)
      }} />
      <button type="button" className="knop rand klein" onClick={() => ref.current?.click()}><Icoon naam="upload" maat={16} />{tekst}</button>
      {fout && <span className="fout-tekst">{fout}</span>}
    </span>
  )
}
