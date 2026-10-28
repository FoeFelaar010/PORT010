import { useStore } from '../../lib/store.jsx'
import { useBevestig } from '../../components/ui.jsx'
import { ga } from '../../lib/router.js'

// Gedeelde acties voor de projectlijst en de editor, met de juiste rechten en bevestigingen.
export function useProjectActies() {
  const { data, acties, kan, ik } = useStore()
  const [bevestig, venster] = useBevestig()

  const toewijzingen = (id) => data.toewijzingen.filter((t) => t.projectId === id).length
  const magVerwijderen = (p) =>
    kan('project.verwijderen') || (kan('project.verwijderen.eigen') && p.status === 'concept' && p.eigenaarId === ik.docent && !toewijzingen(p.id))

  return {
    venster,
    magVerwijderen,
    async publiceren(p) {
      const tekst = p.live
        ? `Versie ${p.versie + 1} publiceren? Leerlingen en bezoekers zien daarna de nieuwe versie.`
        : 'Dit project publiceren? Het wordt dan zichtbaar voor iedereen.'
      if (await bevestig(tekst, 'Publiceren')) acties.projectPubliceren(p.id)
    },
    dupliceren(p) { ga('/docent/project/' + acties.projectDupliceren(p.id)) },
    async archiveren(p) {
      const n = toewijzingen(p.id)
      if (await bevestig(`"${p.titel}" archiveren? Het verdwijnt van de website${n ? ` en bij ${n} klas(sen) die eraan werken` : ''}. Je kunt het later terugzetten.`, 'Archiveren')) acties.projectArchiveren(p.id)
    },
    async verwijderen(p, daarna) {
      const n = toewijzingen(p.id)
      if (await bevestig(`"${p.titel}" definitief verwijderen?${n ? ` Het is toegewezen aan ${n} klas(sen); die toewijzingen verdwijnen ook.` : ''} Dit kan niet ongedaan worden gemaakt.`, 'Verwijderen', true)) {
        acties.projectVerwijderen(p.id)
        if (daarna) daarna()
      }
    },
  }
}
