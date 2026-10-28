# PORT010 · context voor Claude Code

Leer- en praktijkplatform voor PORT (praktijkgericht onderwijs) van Melanchthon Mavo Schiebroek (school van CVO).
Eigenaar: Joey Bonte (j.bonte@cvo.nl), docent PORT. Communiceer in het Nederlands, kort en praktisch.
Los van het MOL-portaal (`..\Project MOL`) en de handleidingensite (`..\Project PORT-site`); patronen hergebruiken, gegevens niet.

## Uitgangspunt
Docenten beheren alle inhoud in de website zelf (projecten, handleidingen, lijsten, rechten), zonder code, GitHub of Claude.
Goedgekeurd voorstel (ontwerp, inhoudsmodel, rechten, bouwplan): https://claude.ai/artifact/QHa95bemPhwTdZ83w6uaxk

## Stack
- React 18 + Vite 5, hash-adressen (`src/lib/router.js`), GitHub Pages via `.github/workflows/deploy.yml` ("Online zetten").
- `vite.config.js` gebruikt `base: './'`; afbeeldingen uit `public/` relatief laden (`./logo-melanchthon-port.png`).
- Huisstijl: kleuren van melanchthon.nl/mavoschiebroek (paars #6b2475, donkerblauw #00447c, Open Sans) met PORT-oranje #f39200
  als accent (hoofdknoppen, voortgang, huidige stap). Koppen in Lexend. Donkere tekst op oranje (wit is onleesbaar).
- Logo's: `public/logo-melanchthon-port.png` (bovenbalk), `public/port-icoon.png`. Bron: `..\PORT_Handleidingen_v26_02\06_Huisstijl`.

## Opbouw
- Vijf omgevingen: openbaar (bovenmenu), leerling, docent, beheer, opdrachtgever (zijmenu, max. zes onderdelen).
- `src/lib/rechten.js`: rollen, rechtcodes en standaardmatrix. Elke knop controleert `kan('code')`; beheer past de matrix aan.
- `src/lib/store.jsx`: alle gegevens + acties. **Fase 1: localStorage van de browser** (sleutel `port010-demo-v1`).
  Fase 2 vervangt dit door Supabase met dezelfde functienamen.
- `src/data/demo.js`: fictieve demo-inhoud (4 gepubliceerde projecten, 1 concept, handleidingen, aanmeldingen, klassen).
- Projectversies: publiceren zet een kopie in `project.live`; bezoekers en leerlingen zien alleen `live`. Bewerken daarna geeft
  `wijzigingen: true` tot opnieuw publiceren. Webadres (slug) volgt de titel tot de eerste publicatie.
- Bronnen (handleiding, informatieblad, werkblad, afbeelding, video, download) staan één keer in de bibliotheek en worden aan
  projecten gekoppeld (`bronIds`), niet gekopieerd. Tekst als blokken (tekst, kop, stappen, tip, let op, veiligheid, afbeelding).
- Opdrachtgevers krijgen geen account maar een statuscode (`#/aanmelding/CODE`).

## Bouwplan
0 opzet ✔ · 1 klikbare portal met demogegevens ✔ (okt 2026) · 2 database (nieuw Supabase-project, EU) · 3 inhoudsbeheer echt
(uploads naar Storage) · 4 aanmeldingen + toewijzen echt · 5 inloggen (Microsoft) en rechten in de database, alleen op opdracht ·
6 leerlingwerk inleveren en beoordelen.
- Tot fase 5: toegangscode (bijv. 3052) voor docent/beheer, **gecontroleerd door de database**, nooit in de frontend-code
  (repo is openbaar). Max. 5 foute pogingen per kwartier. In fase 1 is er bewust geen code: "Bekijk als" wisselt de rol.

## Privacy
- Geen echte leerling- of docentgegevens vóór akkoord van ICT/FG. Demo-namen zijn verzonnen.
- Opdrachtgevers zien nooit leerlingwerk of leerlingnamen.
- Geen Zermelo-exports of secrets in de repo (*.csv, *.xlsx en .env staan in .gitignore).

## Online zetten
- Op deze pc staan geen git/node/gh. Repo (voorstel FoeFelaar010/port010) maakt de gebruiker op github.com;
  Settings → Pages → Source: GitHub Actions.
- Uploaden via github.com (Add file → Upload files): slepen slaat bestanden met een punt over (.github, .gitignore);
  die via Add file → Create new file (pad `.github/workflows/deploy.yml`).
- Lokaal testen deed Claude met een losse Node in `%TEMP%\p010` (buiten OneDrive): kopie van deze map naar `%TEMP%\p010\bouw`,
  `npm install`, `npm run build`, `vite preview`.
