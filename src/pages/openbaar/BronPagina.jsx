import React from 'react'
import BronWeergave from '../../components/BronWeergave.jsx'
import { Kruimel, Leeg } from '../../components/ui.jsx'
import { useStore, liveBronnen } from '../../lib/store.jsx'
import { bronSoort } from '../../lib/util.js'
import { href } from '../../lib/router.js'

export default function BronPagina({ slug }) {
  const { data } = useStore()
  const b = liveBronnen(data).find((x) => x.slug === slug)
  if (!b) return <Leeg>Deze pagina bestaat niet (meer) of is nog niet gepubliceerd.</Leeg>
  const ouder = b.soort === 'handleiding' ? ['Handleidingen', '/handleidingen'] : b.soort === 'informatieblad' ? ['Informatiebladen', '/informatiebladen'] : [bronSoort(b.soort)]
  const projecten = data.projecten.filter((p) => p.status === 'gepubliceerd' && p.live?.bronIds.includes(b.id)).map((p) => p.live)
  return (
    <div className="pagina smal" style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Kruimel items={[ouder, [b.titel]]} />
      <h1>{b.titel}</h1>
      <BronWeergave bron={b} />
      {projecten.length > 0 && (
        <p className="zacht">Hoort bij: {projecten.map((p, i) => <span key={p.id}>{i > 0 && ', '}<a href={href('/projecten/' + p.slug)}>{p.titel}</a></span>)}</p>
      )}
    </div>
  )
}
