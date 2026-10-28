import React from 'react'
import ProjectWeergave from '../../components/ProjectWeergave.jsx'
import { Leeg, Voortgang } from '../../components/ui.jsx'
import { useStore } from '../../lib/store.jsx'
import { mijnProjecten } from './mijn.js'

export default function LeerlingProject({ id }) {
  const { data, ik, acties } = useStore()
  const mijn = mijnProjecten(data, ik.leerling)
  const m = id ? mijn.find((x) => x.p.id === id) : mijn[0]
  if (!m) return <Leeg>Je hebt nog geen project. Je docent zet het hier klaar.</Leeg>
  return (
    <>
      <div className="kaart" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <b>Vink een stap af als je hem klaar hebt.</b>
        <Voortgang waarde={m.procent} />
        <span className="zacht">{m.procent}% klaar</span>
      </div>
      <ProjectWeergave p={m.p} gedaan={m.gedaan} week={m.week} onStap={(s) => acties.stapAfvinken(ik.leerling, m.p.id, s)} />
    </>
  )
}
