import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { maakDemo, IK } from '../data/demo.js'
import { STANDAARD_MATRIX, VAST } from './rechten.js'
import { kopie, nu, slugify, statusCode, uid } from './util.js'

// Fase 1: alle gegevens staan in het geheugen en in localStorage van deze browser.
// Fase 2 vervangt dit bestand door een laag die met Supabase praat; de functienamen blijven gelijk.
const SLEUTEL = 'port010-demo-v1'
const ROL_SLEUTEL = 'port010-rol'

function laad() {
  try {
    const t = localStorage.getItem(SLEUTEL)
    if (t) return JSON.parse(t)
  } catch { /* geen opslag beschikbaar: demo uit het geheugen */ }
  return maakDemo()
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [data, setData] = useState(laad)
  const [rol, setRolState] = useState(() => {
    try { return localStorage.getItem(ROL_SLEUTEL) || 'bezoeker' } catch { return 'bezoeker' }
  })
  const [melding, setMelding] = useState(null)

  useEffect(() => {
    try { localStorage.setItem(SLEUTEL, JSON.stringify(data)) } catch {
      setMelding({ soort: 'fout', tekst: 'De browser kan niet meer opslaan (vol?). Maak bestanden kleiner of zet de demo terug.' })
    }
  }, [data])

  useEffect(() => {
    if (!melding) return
    const t = setTimeout(() => setMelding(null), 3500)
    return () => clearTimeout(t)
  }, [melding])

  const waarde = useMemo(() => {
    const setRol = (r) => {
      setRolState(r)
      try { localStorage.setItem(ROL_SLEUTEL, r) } catch { /* niet erg */ }
    }
    const kan = (code) => (data.matrix[rol] || []).includes(code)
    const meld = (tekst, soort = 'ok') => setMelding({ tekst, soort })

    // Kleine hulp: één lijst in de gegevens bijwerken.
    const zet = (naam, fn) => setData((d) => ({ ...d, [naam]: fn(d[naam]) }))
    const vervang = (naam, item) => zet(naam, (l) => l.map((x) => (x.id === item.id ? item : x)))

    const leegProject = (extra = {}) => ({
      id: uid('p'), slug: '', titel: 'Nieuw project', samenvatting: '', leerjaar: 3, categorieId: '',
      moeilijkheid: 2, weken: 8, kleur: 'paars', afbeelding: '', introductie: '', opdrachtgever: '',
      probleemstelling: '', hoofdvraag: '', leerdoelIds: [], vaardigheidIds: [], deelopdrachten: [],
      planning: [], materialen: [], veiligheid: '', bronIds: [], eindproduct: '', presentatievorm: '',
      criteriumIds: [], reflectievragen: [], status: 'concept', versie: 0, wijzigingen: false,
      gepubliceerdOp: null, gewijzigdOp: nu(), eigenaarId: IK.docent, aanmeldingId: null, live: null,
      ...extra,
    })

    const acties = {
      // Projecten
      projectNieuw(extra) {
        const p = leegProject(extra)
        zet('projecten', (l) => [p, ...l])
        return p.id
      },
      projectOpslaan(p) {
        // Het webadres volgt de titel tot de eerste publicatie; daarna blijft het vast zodat links blijven werken.
        vervang('projecten', {
          ...p, slug: p.live ? p.slug : slugify(p.titel), gewijzigdOp: nu(),
          wijzigingen: p.status === 'gepubliceerd' ? true : p.wijzigingen,
        })
      },
      projectDupliceren(id) {
        const bron = data.projecten.find((p) => p.id === id)
        if (!bron) return null
        const p = kopie(bron)
        // Nieuwe id's voor eigen onderdelen; bronnen, leerdoelen en criteria blijven gekoppeld (geen kopie).
        p.deelopdrachten = p.deelopdrachten.map((o) => ({ ...o, id: uid('o'), stappen: o.stappen.map((s) => ({ ...s, id: uid('s') })) }))
        Object.assign(p, {
          id: uid('p'), titel: p.titel + ' (kopie)', slug: '', status: 'concept', versie: 0, wijzigingen: false,
          gepubliceerdOp: null, gewijzigdOp: nu(), live: null, eigenaarId: IK.docent, aanmeldingId: null,
        })
        zet('projecten', (l) => [p, ...l])
        meld('Kopie gemaakt als concept')
        return p.id
      },
      projectPubliceren(id) {
        zet('projecten', (l) => l.map((p) => {
          if (p.id !== id) return p
          const versie = p.versie + 1
          let slug = p.slug || slugify(p.titel)
          while (l.some((x) => x.id !== p.id && x.live?.slug === slug)) slug += '-2'
          const { live, ...rest } = p
          return { ...p, slug, versie, status: 'gepubliceerd', wijzigingen: false, gepubliceerdOp: nu(),
            live: kopie({ ...rest, slug, versie }) }
        }))
        meld('Gepubliceerd')
      },
      projectArchiveren(id) {
        zet('projecten', (l) => l.map((p) => (p.id === id ? { ...p, status: 'gearchiveerd' } : p)))
        meld('Gearchiveerd')
      },
      projectTerugzetten(id) {
        zet('projecten', (l) => l.map((p) => (p.id === id ? { ...p, status: p.live ? 'gepubliceerd' : 'concept' } : p)))
        meld('Teruggezet')
      },
      projectVerwijderen(id) {
        setData((d) => ({
          ...d,
          projecten: d.projecten.filter((p) => p.id !== id),
          toewijzingen: d.toewijzingen.filter((t) => t.projectId !== id),
        }))
        meld('Verwijderd')
      },

      // Bronnen (handleidingen, informatiebladen, bestanden)
      bronNieuw(soort) {
        const b = { id: uid('b'), slug: '', soort, titel: 'Nieuwe ' + soort, samenvatting: '', categorieId: '',
          blokken: [], url: '', bestand: null, status: 'concept', gewijzigdOp: nu() }
        zet('bronnen', (l) => [b, ...l])
        return b.id
      },
      bronOpslaan(b) {
        vervang('bronnen', { ...b, slug: b.status === 'gepubliceerd' && b.slug ? b.slug : slugify(b.titel), gewijzigdOp: nu() })
      },
      bronVerwijderen(id) {
        setData((d) => ({
          ...d,
          bronnen: d.bronnen.filter((b) => b.id !== id),
          projecten: d.projecten.map((p) => ({ ...p, bronIds: p.bronIds.filter((x) => x !== id) })),
        }))
        meld('Verwijderd')
      },

      // Lijsten: vaardigheden, leerdoelen, categorieen, criteria, klassen, docenten, ...
      lijstNieuw(naam, item) {
        const x = { id: uid(naam.slice(0, 2)), ...item }
        zet(naam, (l) => [...l, x])
        return x.id
      },
      lijstOpslaan(naam, item) { vervang(naam, item) },
      lijstVerwijderen(naam, id) { zet(naam, (l) => l.filter((x) => x.id !== id)) },
      lijstVerplaats(naam, id, richting) {
        zet(naam, (l) => {
          const i = l.findIndex((x) => x.id === id), j = i + richting
          if (i < 0 || j < 0 || j >= l.length) return l
          const n = [...l];[n[i], n[j]] = [n[j], n[i]]
          return n
        })
      },

      // Aanmeldingen van externe opdrachtgevers
      aanmeldingIndienen(a) {
        const code = statusCode()
        zet('aanmeldingen', (l) => [{ ...a, id: uid('a'), code, status: 'ter_beoordeling', reden: '', notitie: '',
          projectId: null, ingediendOp: nu() }, ...l])
        return code
      },
      aanmeldingOpslaan(a) { vervang('aanmeldingen', a) },
      aanmeldingGoedkeuren(id) {
        const a = data.aanmeldingen.find((x) => x.id === id)
        if (!a) return null
        const p = leegProject({
          titel: a.titel || 'Project van ' + a.organisatie, samenvatting: a.vraag.slice(0, 160),
          opdrachtgever: a.organisatie, probleemstelling: a.vraag, eindproduct: a.resultaat,
          aanmeldingId: a.id, leerjaar: a.leerjaar || 3,
        })
        setData((d) => ({
          ...d,
          projecten: [p, ...d.projecten],
          aanmeldingen: d.aanmeldingen.map((x) => (x.id === id ? { ...x, status: 'goedgekeurd', projectId: p.id } : x)),
        }))
        meld('Goedgekeurd: er staat een conceptproject klaar')
        return p.id
      },
      aanmeldingAfwijzen(id, reden) {
        zet('aanmeldingen', (l) => l.map((x) => (x.id === id ? { ...x, status: 'afgewezen', reden } : x)))
        meld('Afgewezen')
      },

      // Toewijzen en voortgang
      toewijzen(t) {
        zet('toewijzingen', (l) => [...l, { ...t, id: uid('t'), docentId: IK.docent }])
        meld('Toegewezen')
      },
      toewijzingVerwijderen(id) { zet('toewijzingen', (l) => l.filter((t) => t.id !== id)) },
      stapAfvinken(leerlingId, projectId, stapId) {
        zet('voortgang', (v) => {
          const lijst = v[leerlingId]?.[projectId] || []
          const nieuw = lijst.includes(stapId) ? lijst.filter((x) => x !== stapId) : [...lijst, stapId]
          return { ...v, [leerlingId]: { ...(v[leerlingId] || {}), [projectId]: nieuw } }
        })
      },

      // Rechten
      rechtZetten(r, code, aan) {
        if (VAST[r]?.includes(code)) return
        zet('matrix', (m) => ({ ...m, [r]: aan ? [...new Set([...(m[r] || []), code])] : (m[r] || []).filter((c) => c !== code) }))
      },
      rechtenStandaard() { zet('matrix', () => kopie(STANDAARD_MATRIX)); meld('Standaardrechten teruggezet') },

      herstelDemo() { setData(maakDemo()); meld('Demo-inhoud teruggezet') },
    }

    return { data, rol, setRol, kan, acties, meld, melding, ik: IK }
  }, [data, rol, melding])

  return <Ctx.Provider value={waarde}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)

// Wat een bezoeker of leerling ziet: de gepubliceerde versie, niet het concept waaraan gewerkt wordt.
export const liveProjecten = (data) => data.projecten.filter((p) => p.status === 'gepubliceerd' && p.live).map((p) => p.live)
export const liveBronnen = (data) => data.bronnen.filter((b) => b.status === 'gepubliceerd')
