import { projectWeek } from '../../lib/util.js'

// Toegewezen projecten van een leerling (via klas, groep of persoonlijk), met voortgang.
export function mijnProjecten(data, leerlingId) {
  const ll = data.leerlingen.find((l) => l.id === leerlingId)
  if (!ll) return []
  const groepen = data.groepen.filter((g) => g.leerlingIds.includes(leerlingId)).map((g) => g.id)
  return data.toewijzingen
    .filter((t) => (t.doelType === 'klas' && t.doelId === ll.klasId) || (t.doelType === 'groep' && groepen.includes(t.doelId))
      || (t.doelType === 'leerling' && t.doelId === leerlingId))
    .map((t) => {
      const bron = data.projecten.find((p) => p.id === t.projectId)
      if (!bron?.live || bron.status !== 'gepubliceerd') return null
      const p = bron.live
      const gedaan = data.voortgang[leerlingId]?.[p.id] || []
      const stappen = p.deelopdrachten.flatMap((o) => o.stappen)
      const klaar = stappen.filter((s) => gedaan.includes(s.id)).length
      return { p, toewijzing: t, gedaan, procent: stappen.length ? Math.round((klaar / stappen.length) * 100) : 0,
        volgende: stappen.find((s) => !gedaan.includes(s.id)), week: projectWeek(t.startDatum) }
    })
    .filter(Boolean)
}

export function voortgangVan(data, leerlingId, project) {
  const gedaan = data.voortgang[leerlingId]?.[project.id] || []
  const stappen = project.deelopdrachten.flatMap((o) => o.stappen)
  return stappen.length ? Math.round((stappen.filter((s) => gedaan.includes(s.id)).length / stappen.length) * 100) : 0
}
