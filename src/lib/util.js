export const uid = (voor = 'id') => voor + '-' + Math.random().toString(36).slice(2, 9)

export function slugify(t) {
  return (t || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'zonder-titel'
}

export const nu = () => new Date().toISOString()

const maanden = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
export function datum(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getDate()} ${maanden[d.getMonth()]} ${d.getFullYear()}`
}

export function statusCode() {
  const t = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => t[Math.floor(Math.random() * t.length)]).join('')
}

// Diepe kopie voor versies en dupliceren (gegevens zijn gewone JSON).
export const kopie = (x) => JSON.parse(JSON.stringify(x))

export const MOEILIJKHEID = { 1: 'Instap', 2: 'Gevorderd', 3: 'Uitdagend' }

export const BRONSOORTEN = [
  { id: 'handleiding', naam: 'Handleiding', meervoud: 'Handleidingen' },
  { id: 'informatieblad', naam: 'Informatieblad', meervoud: 'Informatiebladen' },
  { id: 'werkblad', naam: 'Werkblad', meervoud: 'Werkbladen' },
  { id: 'afbeelding', naam: 'Afbeelding', meervoud: 'Afbeeldingen' },
  { id: 'video', naam: 'Video', meervoud: "Video's" },
  { id: 'download', naam: 'Download', meervoud: 'Downloads' },
]
export const bronSoort = (id) => BRONSOORTEN.find((s) => s.id === id)?.naam ?? id
export const heeftTekst = (soort) => soort === 'handleiding' || soort === 'informatieblad' || soort === 'werkblad'

// Week van het project op basis van de startdatum van een toewijzing (week 1 = startweek).
export function projectWeek(startDatum) {
  if (!startDatum) return null
  const dagen = Math.floor((Date.now() - new Date(startDatum).getTime()) / 86400000)
  return dagen < 0 ? 0 : Math.floor(dagen / 7) + 1
}
