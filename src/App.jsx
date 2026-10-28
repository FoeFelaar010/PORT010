import React from 'react'
import { useRoute } from './lib/router.js'
import { useStore } from './lib/store.jsx'
import { rolNaam } from './lib/rechten.js'
import { OpenbaarLayout, AppLayout } from './components/Layout.jsx'

import Home from './pages/openbaar/Home.jsx'
import Projecten from './pages/openbaar/Projecten.jsx'
import ProjectPagina from './pages/openbaar/ProjectPagina.jsx'
import Bronnen from './pages/openbaar/Bronnen.jsx'
import BronPagina from './pages/openbaar/BronPagina.jsx'
import Vaardigheden from './pages/openbaar/Vaardigheden.jsx'
import Aanmelden from './pages/openbaar/Aanmelden.jsx'
import AanmeldingStatus from './pages/openbaar/AanmeldingStatus.jsx'
import LeerlingHome from './pages/leerling/LeerlingHome.jsx'
import LeerlingProject from './pages/leerling/LeerlingProject.jsx'
import LeerlingPlanning from './pages/leerling/LeerlingPlanning.jsx'
import LeerlingVaardigheden from './pages/leerling/LeerlingVaardigheden.jsx'
import DocentHome from './pages/docent/DocentHome.jsx'
import DocentProjecten from './pages/docent/DocentProjecten.jsx'
import ProjectEditor from './pages/docent/ProjectEditor.jsx'
import Aanmeldingen from './pages/docent/Aanmeldingen.jsx'
import Klassen from './pages/docent/Klassen.jsx'
import Bibliotheek from './pages/docent/Bibliotheek.jsx'
import BronEditor from './pages/docent/BronEditor.jsx'
import BeheerHome from './pages/beheer/BeheerHome.jsx'
import Rechten from './pages/beheer/Rechten.jsx'
import Lijsten from './pages/beheer/Lijsten.jsx'
import Gebruikers from './pages/beheer/Gebruikers.jsx'
import OpdrachtgeverHome from './pages/opdrachtgever/OpdrachtgeverHome.jsx'
import OpdrachtgeverUitleg from './pages/opdrachtgever/OpdrachtgeverUitleg.jsx'

// Welke rol(len) een afgeschermd gebied mogen openen. Fase 5: afgedwongen met echte accounts.
const GEBIED_ROLLEN = {
  leerling: ['leerling'],
  docent: ['docent', 'beheerder'],
  beheer: ['beheerder'],
  opdrachtgever: ['opdrachtgever'],
}
const ROL_GEBIED = { leerling: 'leerling', docent: 'docent', beheerder: 'beheer', opdrachtgever: 'opdrachtgever' }

function pagina(delen, query) {
  const [a, b, c] = delen
  switch (a) {
    case undefined: return <Home />
    case 'projecten': return b ? <ProjectPagina slug={b} /> : <Projecten query={query} />
    case 'handleidingen': return b ? <BronPagina slug={b} /> : <Bronnen soort="handleiding" />
    case 'informatiebladen': return b ? <BronPagina slug={b} /> : <Bronnen soort="informatieblad" />
    case 'bron': return <BronPagina slug={b} />
    case 'vaardigheden': return <Vaardigheden />
    case 'aanmelden': return <Aanmelden />
    case 'aanmelding': return <AanmeldingStatus code={b} />
    case 'leerling':
      if (b === 'project') return <LeerlingProject id={c} />
      if (b === 'planning') return <LeerlingPlanning />
      if (b === 'vaardigheden') return <LeerlingVaardigheden />
      return <LeerlingHome />
    case 'docent':
      if (b === 'projecten') return <DocentProjecten />
      if (b === 'project') return <ProjectEditor key={c + (query.stap || '')} id={c} stap={query.stap} />
      if (b === 'aanmeldingen') return <Aanmeldingen id={c} />
      if (b === 'klassen') return <Klassen klasId={c} />
      if (b === 'bibliotheek') return <Bibliotheek query={query} />
      if (b === 'bron') return <BronEditor id={c} />
      return <DocentHome />
    case 'beheer':
      if (b === 'rechten') return <Rechten />
      if (b === 'lijsten') return <Lijsten lijst={c} />
      if (b === 'gebruikers') return <Gebruikers />
      return <BeheerHome />
    case 'opdrachtgever':
      if (b === 'aanmelden') return <Aanmelden alsOpdrachtgever />
      if (b === 'uitleg') return <OpdrachtgeverUitleg />
      return <OpdrachtgeverHome />
    default: return <NietGevonden />
  }
}

function NietGevonden() {
  return (
    <div className="kaart">
      <h1>Deze pagina bestaat niet</h1>
      <p style={{ marginTop: 8 }}>Misschien is de link verouderd. <a href="#/">Naar de startpagina</a></p>
    </div>
  )
}

function GeenToegang({ gebied }) {
  const { setRol } = useStore()
  const rollen = GEBIED_ROLLEN[gebied]
  return (
    <div className="kaart" style={{ maxWidth: 560 }}>
      <h1>Deze pagina is voor {rollen.map(rolNaam).join(' of ').toLowerCase()}</h1>
      <p style={{ margin: '8px 0 16px' }}>In deze demo kies je bovenaan bij "Bekijk als" welke omgeving je ziet. Later log je hier in.</p>
      <button className="knop" onClick={() => setRol(rollen[0])}>Bekijk als {rolNaam(rollen[0]).toLowerCase()}</button>
    </div>
  )
}

export default function App() {
  const { delen, query } = useRoute()
  const { rol, data, ik } = useStore()
  const pad = '/' + delen.join('/')
  const gebied = GEBIED_ROLLEN[delen[0]] ? delen[0] : null
  const inhoud = gebied && !GEBIED_ROLLEN[gebied].includes(rol) ? <GeenToegang gebied={gebied} /> : pagina(delen, query)

  if (rol === 'bezoeker') return <OpenbaarLayout pad={pad}>{inhoud}</OpenbaarLayout>

  const wie = {
    leerling: () => { const l = data.leerlingen.find((x) => x.id === ik.leerling); const k = data.klassen.find((x) => x.id === l?.klasId); return [l?.naam, 'Leerling · ' + (k?.naam || '')] },
    docent: () => [data.docenten.find((x) => x.id === ik.docent)?.naam, 'Docent'],
    beheerder: () => [data.docenten.find((x) => x.id === ik.beheerder)?.naam, 'Beheerder'],
    opdrachtgever: () => { const o = data.opdrachtgevers.find((x) => x.id === ik.opdrachtgever); return [o?.organisatie, o?.contactpersoon] },
  }[rol]?.()
  return <AppLayout gebied={ROL_GEBIED[rol]} pad={pad} wie={wie}>{inhoud}</AppLayout>
}
