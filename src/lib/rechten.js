// Eén centrale lijst met rollen en rechten. De beheerder kan de matrix aanpassen (Beheer → Rechten).
// Fase 1: de rol komt uit de keuze "Bekijk als". Fase 5: uit het account, en dezelfde codes
// worden dan in de database afgedwongen (RLS + functies).

export const ROLLEN = [
  { id: 'bezoeker', naam: 'Bezoeker', start: '/' },
  { id: 'leerling', naam: 'Leerling', start: '/leerling' },
  { id: 'docent', naam: 'Docent', start: '/docent' },
  { id: 'beheerder', naam: 'Beheerder', start: '/beheer' },
  { id: 'opdrachtgever', naam: 'Opdrachtgever', start: '/opdrachtgever' },
]

export const RECHTEN = [
  { code: 'project.aanmelden', naam: 'Project aanmelden' },
  { code: 'project.maken', naam: 'Projecten maken en bewerken' },
  { code: 'project.publiceren', naam: 'Projecten publiceren en archiveren' },
  { code: 'project.verwijderen.eigen', naam: 'Eigen concepten verwijderen' },
  { code: 'project.verwijderen', naam: 'Alle projecten verwijderen' },
  { code: 'bronnen.beheren', naam: 'Handleidingen en bronnen beheren' },
  { code: 'bronnen.publiceren', naam: 'Handleidingen en bronnen publiceren' },
  { code: 'aanmeldingen.beoordelen', naam: 'Aanmeldingen beoordelen' },
  { code: 'projecten.toewijzen', naam: 'Projecten toewijzen aan klassen' },
  { code: 'werk.beoordelen', naam: 'Leerlingwerk beoordelen (later)' },
  { code: 'lijsten.beheren', naam: 'Lijsten beheren' },
  { code: 'gebruikers.beheren', naam: 'Gebruikers beheren' },
  { code: 'rechten.beheren', naam: 'Rechten beheren' },
]

const docent = [
  'project.maken', 'project.publiceren', 'project.verwijderen.eigen', 'bronnen.beheren',
  'bronnen.publiceren', 'aanmeldingen.beoordelen', 'projecten.toewijzen', 'werk.beoordelen',
]

export const STANDAARD_MATRIX = {
  bezoeker: ['project.aanmelden'],
  leerling: [],
  opdrachtgever: ['project.aanmelden'],
  docent,
  beheerder: [...docent, 'project.verwijderen', 'lijsten.beheren', 'gebruikers.beheren', 'rechten.beheren'],
}

// Dit recht kan de beheerder zichzelf niet afnemen, anders kan niemand het terugzetten.
export const VAST = { beheerder: ['rechten.beheren'] }

export const rolNaam = (id) => ROLLEN.find((r) => r.id === id)?.naam ?? id
