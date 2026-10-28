// Demo-inhoud voor fase 1. Alle personen en organisaties zijn verzonnen.
import { STANDAARD_MATRIX } from '../lib/rechten.js'
import { kopie } from '../lib/util.js'

// Wie "ik" ben in elke rol tijdens de demo (fase 5: het ingelogde account).
export const IK = {
  leerling: 'll-sophie',
  docent: 'doc-yilmaz',
  beheerder: 'doc-beheer',
  opdrachtgever: 'og-klimop',
}

export const NIVEAUS = ['Nog niet', 'Op weg', 'Goed', 'Uitstekend']

const vaardigheden = [
  { id: 'va-onderzoeken', naam: 'Onderzoeken', omschrijving: 'Informatie zoeken, vragen stellen en metingen doen om een probleem te begrijpen.' },
  { id: 'va-ontwerpen', naam: 'Ontwerpen', omschrijving: 'Ideeën bedenken, schetsen en de beste keuze onderbouwen.' },
  { id: 'va-maken', naam: 'Maken', omschrijving: 'Veilig en netjes werken met materialen, gereedschap en machines.' },
  { id: 'va-testen', naam: 'Testen en verbeteren', omschrijving: 'Een prototype uitproberen, meten wat er gebeurt en het beter maken.' },
  { id: 'va-samenwerken', naam: 'Samenwerken', omschrijving: 'Taken verdelen, afspraken nakomen en elkaar helpen.' },
  { id: 'va-plannen', naam: 'Plannen', omschrijving: 'Een planning maken, bijhouden en bijsturen als iets uitloopt.' },
  { id: 'va-presenteren', naam: 'Presenteren', omschrijving: 'Je werk duidelijk laten zien en uitleggen aan anderen.' },
  { id: 'va-reflecteren', naam: 'Reflecteren', omschrijving: 'Terugkijken op wat goed ging en wat je volgende keer anders doet.' },
]

const leerdoelen = [
  { id: 'ld-pve', naam: 'Ik kan een programma van eisen opstellen.' },
  { id: 'ld-ideeen', naam: 'Ik kan minstens drie verschillende ideeën schetsen.' },
  { id: 'ld-kiezen', naam: 'Ik kan met een keuzetabel het beste idee kiezen.' },
  { id: 'ld-prototype', naam: 'Ik kan een prototype bouwen, testen en verbeteren.' },
  { id: 'ld-veilig', naam: 'Ik kan veilig werken met gereedschap.' },
  { id: 'ld-meten', naam: 'Ik kan metingen doen en ze in een tabel zetten.' },
  { id: 'ld-uitleggen', naam: 'Ik kan mijn keuzes uitleggen aan een opdrachtgever.' },
  { id: 'ld-planning', naam: 'Ik kan een planning maken en bijhouden.' },
]

const categorieen = [
  { id: 'ca-ontwerpen', naam: 'Ontwerpen', kleur: 'paars' },
  { id: 'ca-techniek', naam: 'Techniek', kleur: 'blauw' },
  { id: 'ca-onderzoek', naam: 'Onderzoek', kleur: 'groen' },
  { id: 'ca-media', naam: 'Media en communicatie', kleur: 'roze' },
  { id: 'ca-duurzaam', naam: 'Duurzaamheid', kleur: 'oranje' },
]

const criteria = [
  { id: 'cr-onderzoek', naam: 'Onderzoek en programma van eisen', vaardigheidId: 'va-onderzoeken',
    niveaus: ['Er is geen of bijna geen onderzoek gedaan.', 'Er is onderzoek gedaan, maar de eisen zijn vaag.', 'Duidelijke eisen die uit het onderzoek volgen.', 'Eisen zijn meetbaar en goed onderbouwd met bronnen of metingen.'] },
  { id: 'cr-ideeen', naam: 'Ideeën en keuze', vaardigheidId: 'va-ontwerpen',
    niveaus: ['Eén idee, geen keuze uitgelegd.', 'Twee of drie ideeën, keuze kort uitgelegd.', 'Drie of meer ideeën en een keuzetabel.', 'Verrassende ideeën en een keuze die je overtuigend uitlegt.'] },
  { id: 'cr-product', naam: 'Prototype of eindproduct', vaardigheidId: 'va-maken',
    niveaus: ['Het product is niet af of werkt niet.', 'Het product werkt deels.', 'Het product werkt en voldoet aan de meeste eisen.', 'Het product werkt goed, is netjes afgewerkt en voldoet aan alle eisen.'] },
  { id: 'cr-testen', naam: 'Testen en verbeteren', vaardigheidId: 'va-testen',
    niveaus: ['Er is niet getest.', 'Er is getest, maar niets verbeterd.', 'Getest, resultaten genoteerd en iets verbeterd.', 'Meerdere testrondes met duidelijke verbeteringen.'] },
  { id: 'cr-samenwerken', naam: 'Samenwerken en planning', vaardigheidId: 'va-samenwerken',
    niveaus: ['Afspraken worden vaak niet nagekomen.', 'Samenwerking gaat redelijk, planning loopt achter.', 'Taken eerlijk verdeeld, planning bijgehouden.', 'Het team stuurt zelf bij en helpt elkaar actief.'] },
  { id: 'cr-presentatie', naam: 'Presentatie', vaardigheidId: 'va-presenteren',
    niveaus: ['Onduidelijk of niet gedaan.', 'Verteld wat je gemaakt hebt.', 'Duidelijk verteld wat je gemaakt hebt en waarom.', 'Boeiend, goed voorbereid en vragen goed beantwoord.'] },
]

const bronnen = [
  { id: 'b-veilig', slug: 'veilig-werken-in-het-praktijklokaal', soort: 'handleiding', titel: 'Veilig werken in het praktijklokaal', categorieId: 'ca-techniek',
    samenvatting: 'Afspraken voor gereedschap, machines en opruimen. Lees dit voordat je begint.', status: 'gepubliceerd',
    blokken: [
      { id: 'k1', type: 'tekst', tekst: 'In het praktijklokaal werk je met echt gereedschap. Dat is leuk, maar het kan ook gevaarlijk zijn. Daarom zijn er een paar vaste afspraken.' },
      { id: 'k2', type: 'kop', tekst: 'Voordat je begint' },
      { id: 'k3', type: 'stappen', tekst: 'Lange haren vast en jas uit.\nVraag de docent welke machine je mag gebruiken.\nPak alleen het gereedschap dat je nodig hebt.' },
      { id: 'k4', type: 'veilig', tekst: 'Gebruik de boormachine, de figuurzaag en het lijmpistool alleen als de docent het heeft uitgelegd.' },
      { id: 'k5', type: 'kop', tekst: 'Na afloop' },
      { id: 'k6', type: 'stappen', tekst: 'Zet machines uit en haal de stekker eruit.\nLeg gereedschap terug op de vaste plek.\nVeeg je werkplek schoon.' },
    ] },
  { id: 'b-schetsen', slug: 'schetsen-in-perspectief', soort: 'handleiding', titel: 'Schetsen in perspectief', categorieId: 'ca-ontwerpen',
    samenvatting: 'Snel een idee op papier zetten met één verdwijnpunt.', status: 'gepubliceerd',
    blokken: [
      { id: 'k1', type: 'tekst', tekst: 'Met een perspectieftekening zie je hoe iets er in het echt uitziet. Je hebt alleen een potlood, een liniaal en papier nodig.' },
      { id: 'k2', type: 'stappen', tekst: 'Teken een horizontale lijn: de horizon.\nZet een punt op de horizon: het verdwijnpunt.\nTeken de voorkant van je voorwerp als rechthoek.\nTrek lijnen van de hoeken naar het verdwijnpunt.\nKies hoe diep het voorwerp is en maak de achterkant af.' },
      { id: 'k3', type: 'tip', tekst: 'Teken eerst licht. Pas als het klopt, trek je de lijnen dikker over.' },
    ] },
  { id: 'b-maquette', slug: 'een-maquette-bouwen', soort: 'handleiding', titel: 'Een maquette bouwen', categorieId: 'ca-ontwerpen',
    samenvatting: 'Van tekening naar schaalmodel van karton of foamboard.', status: 'gepubliceerd',
    blokken: [
      { id: 'k1', type: 'tekst', tekst: 'Een maquette is een verkleind model. Je laat ermee zien hoe je ontwerp eruitziet, zonder het echt te bouwen.' },
      { id: 'k2', type: 'kop', tekst: 'Rekenen met schaal' },
      { id: 'k3', type: 'tekst', tekst: 'Schaal 1:20 betekent: 1 cm op de maquette is 20 cm in het echt. Een fietsenrek van 2 meter lang wordt dus 10 cm.' },
      { id: 'k4', type: 'stappen', tekst: 'Reken alle maten om naar de schaal.\nTeken de onderdelen op karton.\nSnijd ze uit op een snijmat.\nLijm de onderdelen in elkaar.' },
      { id: 'k5', type: 'letop', tekst: 'Snijd altijd van je af en gebruik een stalen liniaal.' },
    ] },
  { id: 'b-pitch', slug: 'een-pitch-geven', soort: 'handleiding', titel: 'Een pitch geven', categorieId: 'ca-media',
    samenvatting: 'In drie minuten je idee verkopen aan een opdrachtgever.', status: 'gepubliceerd',
    blokken: [
      { id: 'k1', type: 'tekst', tekst: 'Een pitch is een korte presentatie waarin je iemand overtuigt van je idee.' },
      { id: 'k2', type: 'stappen', tekst: 'Begin met het probleem: wat gaat er nu mis?\nVertel je oplossing in één zin.\nLaat je prototype of maquette zien.\nVertel waarom jouw oplossing werkt.\nSluit af met een vraag aan de opdrachtgever.' },
      { id: 'k3', type: 'tip', tekst: 'Oefen hardop met een timer. Drie minuten is korter dan je denkt.' },
    ] },
  { id: 'b-solderen', slug: 'solderen-voor-beginners', soort: 'handleiding', titel: 'Solderen voor beginners', categorieId: 'ca-techniek',
    samenvatting: 'Twee draden of een onderdeel stevig verbinden met tin.', status: 'concept',
    blokken: [
      { id: 'k1', type: 'veilig', tekst: 'De soldeerbout wordt meer dan 300 °C. Leg hem altijd terug in de houder.' },
      { id: 'k2', type: 'stappen', tekst: 'Zet de soldeerbout aan en wacht tot hij heet is.\nVerwarm de draad en het soldeereiland tegelijk.\nHoud het tin tegen de verbinding, niet tegen de bout.\nHaal eerst het tin weg, dan de bout.' },
    ] },
  { id: 'b-ontwerpcyclus', slug: 'de-ontwerpcyclus', soort: 'informatieblad', titel: 'De ontwerpcyclus', categorieId: 'ca-ontwerpen',
    samenvatting: 'De vaste stappen die ontwerpers doorlopen, van probleem tot presentatie.', status: 'gepubliceerd',
    blokken: [
      { id: 'k1', type: 'tekst', tekst: 'Ontwerpers werken in een cyclus. Dat betekent dat je stappen soms opnieuw doet als een test tegenvalt.' },
      { id: 'k2', type: 'stappen', tekst: 'Oriënteren: wat is het probleem en voor wie?\nEisen opstellen: waar moet de oplossing aan voldoen?\nIdeeën bedenken: zo veel mogelijk, nog niet kiezen.\nKiezen: welk idee past het best bij de eisen?\nMaken: een prototype of maquette.\nTesten en verbeteren.\nPresenteren aan de opdrachtgever.' },
    ] },
  { id: 'b-pve', slug: 'programma-van-eisen', soort: 'informatieblad', titel: 'Een programma van eisen maken', categorieId: 'ca-onderzoek',
    samenvatting: 'Wat is een eis, wat is een wens, en hoe maak je ze meetbaar?', status: 'gepubliceerd',
    blokken: [
      { id: 'k1', type: 'tekst', tekst: 'Een eis moet. Een wens mag. "Het rek past in de stalling" is een eis. "Het rek heeft de kleuren van de school" is een wens.' },
      { id: 'k2', type: 'tip', tekst: 'Maak eisen meetbaar: niet "groot genoeg", maar "minstens 40 fietsen".' },
    ] },
  { id: 'b-samenwerken', slug: 'samenwerken-in-een-projectgroep', soort: 'informatieblad', titel: 'Samenwerken in een projectgroep', categorieId: 'ca-media',
    samenvatting: 'Rollen, afspraken en wat je doet als het niet loopt.', status: 'gepubliceerd',
    blokken: [
      { id: 'k1', type: 'tekst', tekst: 'In een projectgroep heeft iedereen een taak. Spreek aan het begin af wie wat doet en schrijf het op.' },
      { id: 'k2', type: 'stappen', tekst: 'Kies een voorzitter, een planner en een materiaalbeheerder.\nMaak een groepscontract met jullie afspraken.\nBespreek aan het eind van elke les wat af is.' },
    ] },
  { id: 'b-keuzetabel', slug: 'werkblad-keuzetabel', soort: 'werkblad', titel: 'Werkblad keuzetabel', categorieId: 'ca-ontwerpen',
    samenvatting: 'Zet je ideeën naast elkaar en geef punten per eis.', status: 'gepubliceerd',
    blokken: [
      { id: 'k1', type: 'tekst', tekst: 'Zet je ideeën bovenaan in de kolommen en je eisen in de rijen. Geef per eis 1 tot 3 punten. Het idee met de meeste punten kies je.' },
    ] },
  { id: 'b-video-zon', slug: 'video-zonnepanelen', soort: 'video', titel: 'Video: hoe werkt een zonnepaneel?', categorieId: 'ca-duurzaam',
    samenvatting: 'Korte uitlegvideo. De docent voegt de link nog toe.', status: 'concept', blokken: [], url: '' },
].map((b) => ({ url: '', bestand: null, gewijzigdOp: '2026-10-20T10:00:00.000Z', ...b }))

function project(p) {
  return {
    slug: '', samenvatting: '', leerjaar: 1, categorieId: '', moeilijkheid: 1, weken: 6, kleur: 'paars', afbeelding: '',
    introductie: '', opdrachtgever: '', probleemstelling: '', hoofdvraag: '', leerdoelIds: [], vaardigheidIds: [],
    deelopdrachten: [], planning: [], materialen: [], veiligheid: '', bronIds: [], eindproduct: '', presentatievorm: '',
    criteriumIds: [], reflectievragen: [], status: 'concept', versie: 0, wijzigingen: false, gepubliceerdOp: null,
    gewijzigdOp: '2026-10-20T10:00:00.000Z', eigenaarId: IK.docent, aanmeldingId: null, live: null,
    ...p,
  }
}

const st = (id, titel, instructie, minuten) => ({ id, titel, instructie, minuten })

const projecten = [
  project({
    id: 'p-fiets', slug: 'slimme-fietsenstalling', titel: 'Slimme fietsenstalling', leerjaar: 2, categorieId: 'ca-ontwerpen',
    moeilijkheid: 2, weken: 8, kleur: 'paars', status: 'gepubliceerd', versie: 2, gepubliceerdOp: '2026-09-28T09:00:00.000Z',
    samenvatting: 'Ontwerp een stalling waar meer fietsen veilig en overzichtelijk in passen.',
    opdrachtgever: 'Facilitair team van de school',
    introductie: 'Elke ochtend is het druk in de fietsenstalling. Fietsen staan scheef, vallen om of staan in de weg. Het facilitair team wil weten hoe het beter kan.',
    probleemstelling: 'De stalling heeft plek voor ongeveer 120 fietsen, maar er komen er elke dag meer dan 150. Daardoor staan fietsen op het pad en kan de nooduitgang worden geblokkeerd.',
    hoofdvraag: 'Hoe passen er meer fietsen veilig en overzichtelijk in de stalling van de school?',
    leerdoelIds: ['ld-pve', 'ld-ideeen', 'ld-kiezen', 'ld-uitleggen'], vaardigheidIds: ['va-onderzoeken', 'va-ontwerpen', 'va-maken', 'va-presenteren'],
    deelopdrachten: [
      { id: 'o1', titel: 'Onderzoek in de stalling', weekVan: 1, weekTot: 2, uitleg: 'Je gaat kijken hoe de stalling nu wordt gebruikt.', stappen: [
        st('s1', 'Tel de fietsen', 'Tel op twee verschillende dagen om 8.40 uur hoeveel fietsen er staan en hoeveel ernaast.', 30),
        st('s2', 'Meet de stalling op', 'Meet lengte en breedte van de stalling en teken een plattegrond met maten.', 45),
        st('s3', 'Interview gebruikers', 'Vraag vijf leerlingen wat zij lastig vinden aan de stalling. Schrijf de antwoorden op.', 30),
      ] },
      { id: 'o2', titel: 'Eisen en ideeën', weekVan: 3, weekTot: 4, uitleg: 'Je maakt een programma van eisen en bedenkt oplossingen.', stappen: [
        st('s4', 'Programma van eisen', 'Schrijf minstens vijf eisen en twee wensen. Maak ze meetbaar.', 45),
        st('s5', 'Drie schetsen', 'Schets drie verschillende oplossingen. Denk ook aan rekken in twee lagen of schuin parkeren.', 60),
        st('s6', 'Kies met een keuzetabel', 'Vergelijk je schetsen met de keuzetabel en kies één idee.', 30),
      ] },
      { id: 'o3', titel: 'Maquette', weekVan: 5, weekTot: 7, uitleg: 'Je bouwt je gekozen ontwerp op schaal 1:20.', stappen: [
        st('s7', 'Maten omrekenen', 'Reken alle maten om naar schaal 1:20.', 30),
        st('s8', 'Bouwen', 'Bouw de maquette van karton of foamboard.', 135),
        st('s9', 'Testen met modelfietsjes', 'Kijk of er meer fietsen in passen dan nu. Noteer hoeveel.', 30),
      ] },
      { id: 'o4', titel: 'Pitch', weekVan: 8, weekTot: 8, uitleg: 'Je presenteert je ontwerp aan het facilitair team.', stappen: [
        st('s10', 'Pitch voorbereiden', 'Maak een pitch van drie minuten met je maquette.', 45),
        st('s11', 'Pitch geven', 'Presenteer aan het facilitair team en beantwoord hun vragen.', 15),
      ] },
    ],
    planning: [
      { week: 1, onderwerp: 'Start, tellen en meten', mijlpaal: false },
      { week: 2, onderwerp: 'Interviews en plattegrond', mijlpaal: false },
      { week: 3, onderwerp: 'Programma van eisen', mijlpaal: true },
      { week: 4, onderwerp: 'Schetsen en keuze', mijlpaal: false },
      { week: 5, onderwerp: 'Maquette: onderdelen', mijlpaal: false },
      { week: 6, onderwerp: 'Maquette: in elkaar zetten', mijlpaal: false },
      { week: 7, onderwerp: 'Testen en verbeteren', mijlpaal: true },
      { week: 8, onderwerp: 'Pitch voor het facilitair team', mijlpaal: true },
    ],
    materialen: [
      { naam: 'Rolmaat (5 m)', soort: 'gereedschap', aantal: '1 per groep' },
      { naam: 'Karton of foamboard', soort: 'materiaal', aantal: '2 platen per groep' },
      { naam: 'Snijmat, stalen liniaal en afbreekmes', soort: 'gereedschap', aantal: '1 set per groep' },
      { naam: 'Lijmpistool', soort: 'gereedschap', aantal: '1 per groep' },
    ],
    veiligheid: 'Meet in de stalling alleen onder schooltijd en blijf uit de rijbaan. Gebruik het afbreekmes alleen op de snijmat.',
    bronIds: ['b-veilig', 'b-maquette', 'b-pitch', 'b-pve', 'b-keuzetabel'],
    eindproduct: 'Een maquette op schaal 1:20 van de nieuwe stalling, met een plattegrond en een programma van eisen.',
    presentatievorm: 'Pitch van drie minuten voor het facilitair team.',
    criteriumIds: ['cr-onderzoek', 'cr-ideeen', 'cr-product', 'cr-presentatie'],
    reflectievragen: ['Welke eis was het moeilijkst om aan te voldoen?', 'Wat zou je veranderen als je opnieuw begon?', 'Wat heb je geleerd over samenwerken?'],
  }),
  project({
    id: 'p-water', slug: 'waterfilter-voor-het-schoolfestival', titel: 'Waterfilter voor het schoolfestival', leerjaar: 1, categorieId: 'ca-onderzoek',
    moeilijkheid: 1, weken: 6, kleur: 'groen', status: 'gepubliceerd', versie: 1, gepubliceerdOp: '2026-09-14T09:00:00.000Z',
    samenvatting: 'Maak van slootwater helder water om de plantenbakken op het festival water te geven.',
    opdrachtgever: 'Leerlingenraad (organisatie schoolfestival)',
    introductie: 'Op het schoolfestival staan plantenbakken. De leerlingenraad wil die water geven zonder kraanwater te gebruiken. Achter de school ligt een sloot.',
    probleemstelling: 'Slootwater is troebel en bevat zand, blaadjes en algen. Dat verstopt de gieter en ziet er vies uit.',
    hoofdvraag: 'Hoe maak je van slootwater helder water om planten mee te besproeien?',
    leerdoelIds: ['ld-meten', 'ld-prototype', 'ld-veilig'], vaardigheidIds: ['va-onderzoeken', 'va-testen', 'va-samenwerken'],
    deelopdrachten: [
      { id: 'o1', titel: 'Wat zit er in slootwater?', weekVan: 1, weekTot: 2, uitleg: 'Je onderzoekt een monster slootwater.', stappen: [
        st('s1', 'Monster bekijken', 'Bekijk een potje slootwater. Wat zie je drijven en wat zakt naar de bodem?', 20),
        st('s2', 'Helderheid meten', 'Zet het potje op een krant. Kun je de letters nog lezen? Geef een cijfer van 1 tot 5.', 20),
      ] },
      { id: 'o2', titel: 'Filter bouwen', weekVan: 3, weekTot: 4, uitleg: 'Je bouwt een filter van gerecyclede materialen.', stappen: [
        st('s3', 'Lagen kiezen', 'Kies welke lagen je gebruikt: grind, zand, watten, koffiefilter, actieve kool.', 20),
        st('s4', 'Filter bouwen', 'Bouw je filter in een afgeknipte petfles.', 60),
      ] },
      { id: 'o3', titel: 'Testen en poster', weekVan: 5, weekTot: 6, uitleg: 'Je test je filter en maakt een poster.', stappen: [
        st('s5', 'Drie testrondes', 'Filter drie keer en meet elke keer de helderheid.', 45),
        st('s6', 'Poster maken', 'Maak een poster met je filter, je metingen en je advies.', 60),
      ] },
    ],
    planning: [
      { week: 1, onderwerp: 'Kennismaken met de opdracht', mijlpaal: false },
      { week: 2, onderwerp: 'Slootwater onderzoeken', mijlpaal: false },
      { week: 3, onderwerp: 'Filterlagen kiezen', mijlpaal: false },
      { week: 4, onderwerp: 'Filter bouwen', mijlpaal: true },
      { week: 5, onderwerp: 'Testen', mijlpaal: false },
      { week: 6, onderwerp: 'Poster en presentatie', mijlpaal: true },
    ],
    materialen: [
      { naam: 'Lege petflessen (1,5 l)', soort: 'materiaal', aantal: '2 per groep' },
      { naam: 'Grind, zand, watten, koffiefilters', soort: 'materiaal', aantal: 'per groep' },
      { naam: 'Schaar', soort: 'gereedschap', aantal: '1 per groep' },
    ],
    veiligheid: 'Slootwater is niet om te drinken. Was je handen na elke test.',
    bronIds: ['b-veilig', 'b-ontwerpcyclus', 'b-samenwerken'],
    eindproduct: 'Een werkend waterfilter en een poster met testresultaten.',
    presentatievorm: 'Postermarkt tijdens de les.',
    criteriumIds: ['cr-onderzoek', 'cr-product', 'cr-testen', 'cr-samenwerken'],
    reflectievragen: ['Welke laag in je filter werkte het best?', 'Hoe heb je de taken verdeeld?'],
  }),
  project({
    id: 'p-zon', slug: 'zonnelader-voor-de-aula', titel: 'Zonnelader voor de aula', leerjaar: 3, categorieId: 'ca-techniek',
    moeilijkheid: 3, weken: 8, kleur: 'oranje', status: 'gepubliceerd', versie: 1, wijzigingen: true, gepubliceerdOp: '2026-10-01T09:00:00.000Z',
    samenvatting: 'Ontwerp en bouw een laadpunt dat telefoons oplaadt met zonne-energie.',
    opdrachtgever: 'Sectie natuurkunde',
    introductie: 'In de pauze willen veel leerlingen hun telefoon opladen. De school wil laten zien dat dat ook duurzaam kan.',
    probleemstelling: 'Er zijn te weinig stopcontacten in de aula en de school wil minder stroom van het net gebruiken.',
    hoofdvraag: 'Hoe laad je telefoons op met zonne-energie tijdens de pauze?',
    leerdoelIds: ['ld-meten', 'ld-prototype', 'ld-veilig', 'ld-planning'], vaardigheidIds: ['va-onderzoeken', 'va-maken', 'va-testen', 'va-plannen'],
    deelopdrachten: [
      { id: 'o1', titel: 'Onderzoek', weekVan: 1, weekTot: 2, uitleg: 'Hoeveel energie heb je nodig en hoeveel levert een paneel?', stappen: [
        st('s1', 'Verbruik telefoon', 'Zoek op hoeveel energie (Wh) een telefoonbatterij heeft.', 30),
        st('s2', 'Meten aan een paneel', 'Meet spanning en stroom van een klein zonnepaneel bij het raam.', 45),
      ] },
      { id: 'o2', titel: 'Ontwerp', weekVan: 3, weekTot: 4, uitleg: 'Je ontwerpt de behuizing en de schakeling.', stappen: [
        st('s3', 'Drie ideeën voor de behuizing', 'Schets drie ideeën. Denk aan stevigheid en hoe leerlingen hun telefoon neerleggen.', 60),
        st('s4', 'Schakeling tekenen', 'Teken de schakeling met paneel, laadregelaar, accu en USB-poort.', 45),
      ] },
      { id: 'o3', titel: 'Bouwen en testen', weekVan: 5, weekTot: 7, uitleg: 'Je bouwt het prototype en meet hoe goed het laadt.', stappen: [
        st('s5', 'Solderen', 'Soldeer de schakeling volgens je tekening.', 90),
        st('s6', 'Behuizing maken', 'Maak de behuizing van hout of MDF.', 90),
        st('s7', 'Meetrapport', 'Laad een telefoon een uur op en noteer elke tien minuten het percentage.', 60),
      ] },
    ],
    planning: [
      { week: 1, onderwerp: 'Energie en vermogen', mijlpaal: false }, { week: 2, onderwerp: 'Metingen zonnepaneel', mijlpaal: true },
      { week: 3, onderwerp: 'Ideeën behuizing', mijlpaal: false }, { week: 4, onderwerp: 'Schakeling', mijlpaal: true },
      { week: 5, onderwerp: 'Solderen', mijlpaal: false }, { week: 6, onderwerp: 'Behuizing', mijlpaal: false },
      { week: 7, onderwerp: 'Testen en meetrapport', mijlpaal: true }, { week: 8, onderwerp: 'Presentatie aan de sectie', mijlpaal: true },
    ],
    materialen: [
      { naam: 'Zonnepaneel 6 V / 2 W', soort: 'materiaal', aantal: '1 per groep' },
      { naam: 'Laadregelaar met USB', soort: 'materiaal', aantal: '1 per groep' },
      { naam: 'Soldeerbout en tin', soort: 'gereedschap', aantal: '1 set per groep' },
      { naam: 'Multimeter', soort: 'gereedschap', aantal: '1 per groep' },
    ],
    veiligheid: 'Solderen alleen met afzuiging aan en na uitleg. Sluit de accu pas aan als de docent je schakeling heeft gecontroleerd.',
    bronIds: ['b-veilig', 'b-solderen', 'b-ontwerpcyclus', 'b-video-zon'],
    eindproduct: 'Een werkend prototype van een zonnelader en een meetrapport.',
    presentatievorm: 'Demonstratie aan de sectie natuurkunde.',
    criteriumIds: ['cr-onderzoek', 'cr-product', 'cr-testen', 'cr-samenwerken', 'cr-presentatie'],
    reflectievragen: ['Klopte je berekening met je meting?', 'Wat zou je doen om meer telefoons tegelijk te laden?'],
  }),
  project({
    id: 'p-speel', slug: 'speelobject-voor-de-basisschool', titel: 'Speelobject voor de basisschool', leerjaar: 4, categorieId: 'ca-ontwerpen',
    moeilijkheid: 3, weken: 9, kleur: 'blauw', status: 'gepubliceerd', versie: 1, gepubliceerdOp: '2026-09-20T09:00:00.000Z',
    samenvatting: 'Ontwerp een speelobject waarmee kleuters samen spelen op een klein plein.',
    opdrachtgever: 'OBS De Klimop (fictief)', aanmeldingId: 'a-klimop',
    introductie: 'Basisschool De Klimop heeft een klein schoolplein. De kleuters spelen vooral alleen. De school zoekt een speelobject dat samenspelen uitlokt.',
    probleemstelling: 'Het plein is 12 bij 15 meter en wordt gedeeld door 80 kleuters. Er is weinig ruimte en het object moet veilig zijn voor kinderen van 4 tot 6 jaar.',
    hoofdvraag: 'Welk speelobject laat kleuters samen spelen op een klein plein?',
    leerdoelIds: ['ld-pve', 'ld-ideeen', 'ld-prototype', 'ld-uitleggen'], vaardigheidIds: ['va-onderzoeken', 'va-ontwerpen', 'va-presenteren', 'va-reflecteren'],
    deelopdrachten: [
      { id: 'o1', titel: 'Op bezoek', weekVan: 1, weekTot: 2, uitleg: 'Je bezoekt de basisschool en observeert de kleuters.', stappen: [
        st('s1', 'Observatie', 'Kijk een pauze lang hoe kleuters spelen. Noteer wat ze samen doen.', 45),
        st('s2', 'Interview juf of meester', 'Vraag wat zij belangrijk vinden voor het speelobject.', 30),
      ] },
      { id: 'o2', titel: 'Ontwerpen', weekVan: 3, weekTot: 6, uitleg: 'Van eisen naar gekozen ontwerp.', stappen: [
        st('s3', 'Eisen', 'Maak een programma van eisen, met veiligheid voorop.', 45),
        st('s4', 'Ideeën', 'Bedenk minstens vier ideeën en kies er één.', 90),
      ] },
      { id: 'o3', titel: 'Prototype en presentatie', weekVan: 7, weekTot: 9, uitleg: 'Je maakt een maquette of prototype en presenteert op de basisschool.', stappen: [
        st('s5', 'Maquette of prototype', 'Bouw je ontwerp op schaal of als werkend onderdeel.', 180),
        st('s6', 'Presentatie op De Klimop', 'Presenteer aan de opdrachtgever en laat kleuters reageren.', 45),
      ] },
    ],
    planning: [
      { week: 1, onderwerp: 'Kennismaking opdrachtgever', mijlpaal: true }, { week: 2, onderwerp: 'Observeren', mijlpaal: false },
      { week: 3, onderwerp: 'Eisen', mijlpaal: false }, { week: 4, onderwerp: 'Ideeën', mijlpaal: false },
      { week: 5, onderwerp: 'Keuze', mijlpaal: true }, { week: 6, onderwerp: 'Uitwerken', mijlpaal: false },
      { week: 7, onderwerp: 'Bouwen', mijlpaal: false }, { week: 8, onderwerp: 'Bouwen en testen', mijlpaal: false },
      { week: 9, onderwerp: 'Presentatie op De Klimop', mijlpaal: true },
    ],
    materialen: [{ naam: 'Karton, hout, verf', soort: 'materiaal', aantal: 'per groep' }],
    veiligheid: 'Bij het bezoek aan de basisschool blijf je bij je groep en volg je de afspraken van de school.',
    bronIds: ['b-maquette', 'b-pitch', 'b-ontwerpcyclus', 'b-pve'],
    eindproduct: 'Een maquette of prototype van het speelobject met een korte onderbouwing.',
    presentatievorm: 'Presentatie op de basisschool.',
    criteriumIds: ['cr-onderzoek', 'cr-ideeen', 'cr-product', 'cr-presentatie'],
    reflectievragen: ['Wat leerde je van de kleuters zelf?', 'Hoe was het om voor een echte opdrachtgever te werken?'],
  }),
  project({
    id: 'p-escape', titel: 'Escaperoom voor de open dag', leerjaar: 3, categorieId: 'ca-media', moeilijkheid: 2, weken: 6, kleur: 'roze',
    samenvatting: 'Bedenk een escaperoom van 15 minuten die bezoekers laat zien wat PORT is.',
    opdrachtgever: 'Team open dag',
    hoofdvraag: 'Hoe laat je bezoekers in 15 minuten ervaren wat leerlingen bij PORT doen?',
    vaardigheidIds: ['va-ontwerpen', 'va-samenwerken'],
    deelopdrachten: [{ id: 'o1', titel: 'Puzzels bedenken', weekVan: 1, weekTot: 2, uitleg: '', stappen: [st('s1', 'Thema kiezen', 'Kies een verhaal dat past bij PORT.', 30)] }],
    gewijzigdOp: '2026-10-27T15:00:00.000Z',
  }),
]

const klassen = [
  { id: 'kl-1a', naam: '1A', leerjaar: 1, aantal: 26 }, { id: 'kl-1b', naam: '1B', leerjaar: 1, aantal: 25 },
  { id: 'kl-2a', naam: '2A', leerjaar: 2, aantal: 24 }, { id: 'kl-2b', naam: '2B', leerjaar: 2, aantal: 6 },
  { id: 'kl-3a', naam: '3A', leerjaar: 3, aantal: 4 }, { id: 'kl-3b', naam: '3B', leerjaar: 3, aantal: 23 },
  { id: 'kl-4a', naam: '4A', leerjaar: 4, aantal: 21 },
]

const leerlingen = [
  { id: 'll-sophie', naam: 'Sophie de Vries', klasId: 'kl-2b' },
  { id: 'll-lars', naam: 'Lars Bakker', klasId: 'kl-2b' },
  { id: 'll-emma', naam: 'Emma Jansen', klasId: 'kl-2b' },
  { id: 'll-noah', naam: 'Noah Vermeer', klasId: 'kl-2b' },
  { id: 'll-fleur', naam: 'Fleur de Boer', klasId: 'kl-2b' },
  { id: 'll-ayoub', naam: 'Ayoub El Idrissi', klasId: 'kl-2b' },
  { id: 'll-mila', naam: 'Mila Kok', klasId: 'kl-3a' },
  { id: 'll-daan', naam: 'Daan Visser', klasId: 'kl-3a' },
  { id: 'll-yara', naam: 'Yara Pinas', klasId: 'kl-3a' },
  { id: 'll-sem', naam: 'Sem Hoekstra', klasId: 'kl-3a' },
]

const groepen = [
  { id: 'gr-2b-1', naam: 'Groep 1', klasId: 'kl-2b', leerlingIds: ['ll-sophie', 'll-lars', 'll-emma'] },
  { id: 'gr-2b-2', naam: 'Groep 2', klasId: 'kl-2b', leerlingIds: ['ll-noah', 'll-fleur', 'll-ayoub'] },
]

const docenten = [
  { id: 'doc-yilmaz', naam: 'Dhr. Yilmaz', email: 'yilmaz@voorbeeld.nl', rol: 'docent' },
  { id: 'doc-dewit', naam: 'Mevr. de Wit', email: 'dewit@voorbeeld.nl', rol: 'docent' },
  { id: 'doc-beheer', naam: 'Beheer PORT', email: 'beheer@voorbeeld.nl', rol: 'beheerder' },
]

const opdrachtgevers = [
  { id: 'og-klimop', organisatie: 'OBS De Klimop (fictief)', contactpersoon: 'Mevr. Jansen', email: 'info@klimop.voorbeeld.nl' },
  { id: 'og-kringloop', organisatie: 'Kringloop Schiebroek (fictief)', contactpersoon: 'Dhr. Pauw', email: 'pauw@kringloop.voorbeeld.nl' },
]

const aanmeldingen = [
  { id: 'a-kringloop', code: 'KR7P2Q', opdrachtgeverId: 'og-kringloop', organisatie: 'Kringloop Schiebroek (fictief)', contactpersoon: 'Dhr. Pauw',
    email: 'pauw@kringloop.voorbeeld.nl', telefoon: '', titel: 'Opbergsysteem voor de speelgoedhoek',
    vraag: 'Onze speelgoedhoek is een rommeltje. Klanten kunnen niets vinden en spullen gaan kapot. We zoeken een slim opbergsysteem dat we zelf kunnen bouwen van gebruikt hout.',
    resultaat: 'Een ontwerp met bouwtekening, en als het kan een proefmodel.', leerjaar: 3, beschikbaarheid: 'Woensdag- en donderdagmiddag',
    status: 'ter_beoordeling', reden: '', notitie: '', projectId: null, ingediendOp: '2026-10-24T13:20:00.000Z' },
  { id: 'a-klimop', code: 'KL3M9X', opdrachtgeverId: 'og-klimop', organisatie: 'OBS De Klimop (fictief)', contactpersoon: 'Mevr. Jansen',
    email: 'info@klimop.voorbeeld.nl', telefoon: '', titel: 'Speelobject voor de kleuters',
    vraag: 'Ons schoolplein is klein en de kleuters spelen vooral alleen. Wij zoeken een speelobject dat samenspelen uitlokt.',
    resultaat: 'Maquette of prototype', leerjaar: 4, beschikbaarheid: 'Dinsdagmiddag',
    status: 'goedgekeurd', reden: '', notitie: 'Past goed bij klas 4.', projectId: 'p-speel', ingediendOp: '2026-08-30T10:00:00.000Z' },
  { id: 'a-klimop2', code: 'KL8T4B', opdrachtgeverId: 'og-klimop', organisatie: 'OBS De Klimop (fictief)', contactpersoon: 'Mevr. Jansen',
    email: 'info@klimop.voorbeeld.nl', telefoon: '', titel: 'Nieuwe website voor de school',
    vraag: 'Kunnen leerlingen onze website vernieuwen?', resultaat: 'Een werkende website', leerjaar: 4, beschikbaarheid: '',
    status: 'afgewezen', reden: 'Een complete website past niet bij PORT: leerlingen kunnen die niet onderhouden. Een poster of informatiefolder kan wel.',
    notitie: '', projectId: null, ingediendOp: '2026-09-15T10:00:00.000Z' },
]

const toewijzingen = [
  { id: 't-1', projectId: 'p-fiets', doelType: 'klas', doelId: 'kl-2b', startDatum: '2026-10-05', docentId: 'doc-yilmaz' },
  { id: 't-2', projectId: 'p-zon', doelType: 'klas', doelId: 'kl-3a', startDatum: '2026-10-12', docentId: 'doc-yilmaz' },
]

const voortgang = {
  'll-sophie': { 'p-fiets': ['s1', 's2', 's3', 's4', 's5'] },
  'll-lars': { 'p-fiets': ['s1', 's2', 's3', 's4'] },
  'll-emma': { 'p-fiets': ['s1', 's2', 's3', 's4', 's5', 's6'] },
  'll-noah': { 'p-fiets': ['s1', 's2'] },
  'll-fleur': { 'p-fiets': ['s1', 's2', 's3', 's4', 's5'] },
  'll-ayoub': { 'p-fiets': ['s1', 's2', 's3'] },
  'll-mila': { 'p-zon': ['s1', 's2'] },
  'll-daan': { 'p-zon': ['s1'] },
  'll-yara': { 'p-zon': ['s1', 's2', 's3'] },
}

export function maakDemo() {
  const p = projecten.map((x) => {
    if (x.status !== 'gepubliceerd') return kopie(x)
    const { live, ...rest } = x
    return { ...kopie(x), live: kopie(rest) }
  })
  return kopie({
    projecten: p, bronnen, vaardigheden, leerdoelen, categorieen, criteria, klassen, leerlingen, groepen,
    docenten, opdrachtgevers, aanmeldingen, toewijzingen, voortgang, matrix: STANDAARD_MATRIX,
  })
}
