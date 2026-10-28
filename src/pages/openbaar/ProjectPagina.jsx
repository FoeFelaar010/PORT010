import React from 'react'
import ProjectWeergave from '../../components/ProjectWeergave.jsx'
import { Kruimel, Leeg } from '../../components/ui.jsx'
import { useStore, liveProjecten } from '../../lib/store.jsx'

export default function ProjectPagina({ slug }) {
  const { data } = useStore()
  const p = liveProjecten(data).find((x) => x.slug === slug)
  if (!p) return <Leeg>Dit project bestaat niet (meer) of is nog niet gepubliceerd. <a href="#/projecten">Naar alle projecten</a></Leeg>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Kruimel items={[['Projecten', '/projecten'], [p.titel]]} />
      <ProjectWeergave p={p} />
    </div>
  )
}
