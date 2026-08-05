# Nächste Session — Wiedereinstieg

*Aktueller Stand ganz oben. Ältere Stände darunter als historische Schnappschüsse.*

## STAND 05.08.2026 — Build-Absturz durch Link im Slug-Feld, behoben

**Symptom:** Katharina veröffentlicht, nichts erscheint. Vercel schickte Deploy-Failure-Mails.

**Ursache:** In der Notiz „Vom Lebensfluss getragen" stand ein Google-Photos-Link im Feld „URL-Adresse" (slug). Astro baut daraus den Dateipfad der Detailseite; Schrägstriche darin lassen `getStaticPaths` mit `Missing parameter: slug` abbrechen und reißen den **gesamten** Build mit. Sie hatte den Link zusätzlich korrekt in „Medien-Link" eingetragen, der Wert stand also doppelt da (typischer Doppel-Paste am Handy). Ausfall ab ihrem ersten Publish 10:21 bis ~19:20, fünf verlorene Publishes. Der 25.07.-Stand davor war kein Ausfall, dazwischen wurde schlicht nichts veröffentlicht.

**Fix (Commit `1ea8658`), vier Ebenen:**

- `astro/src/lib/slug.js` (neu): `withSafeSlugs()` prüft jeden Slug aus Sanity, bildet einen unbrauchbaren aus dem Titel neu, wirft Duplikate raus. Läuft auf **allen** Detail- und Listenseiten. Wer eine neue Seite mit `slug.current` baut, muss diese Funktion benutzen, sonst zeigt die Liste auf eine Adresse, die die Route nicht kennt. Tests in `slug.test.js`, laufen bei jedem Build mit (`npm run build` ruft `npm test`).
- `astro/sanity/schemas/_shared.ts`: `slugField()` für alle sechs Doc-Types. Feld heißt jetzt „Adresse dieser Seite" statt „URL-Adresse", mit Hilfetext und Validierung. Bewusst **Warnung statt Fehler**: Ein blockierter Publish-Button fühlt sich am Handy wie ein kaputtes Backend an.
- `AutoSlugPublishAction`: repariert beim Publish auch einen unbrauchbaren (nicht nur fehlenden) Slug, mit erklärendem Toast.
- Startseite „Zuletzt veröffentlicht": sortiert und datiert nach `_createdAt` statt `_updatedAt`. Vorher holte jede Tippfehler-Korrektur eine alte Notiz zurück an die Spitze und zeigte dort das heutige Datum, während dieselbe Notiz in der schreibBAR ihr echtes Datum trug. `isEventArchived()` in `lib/events.js` nutzt weiterhin bewusst `_updatedAt`, kein Widerspruch, Begründung steht dort im Kommentar.

**Verifiziert:** Alle drei Beiträge vom 05.08. live, Detailseiten HTTP 200, Daten zwischen Startseite und Raum-Listen deckungsgleich. Studio deployt, das live ausgelieferte Bundle enthält alle drei Studio-Änderungen, der alte Feldname „URL-Adresse" kommt darin nicht mehr vor. Beide `slugify`-Implementierungen (Astro + Studio) liefern für Testtitel identische Ergebnisse.

**Kosmetisch offen:** Der Link steht noch im Slug-Feld von `f21faaae-6c23-422b-953d-5b947c3cde8b`. Kein Handlungsdruck, kein Datenverlust (Link liegt korrekt in `mediaLink`), das Frontend leitet die Adresse aus dem Titel ab, und beim nächsten Publish räumt die Action das Feld selbst auf.

---

## STAND 19.07.2026 — brauchBAR mit Webseiten

### brauchBAR: Webseite als dritte Art (Katharinas Wunsch 18.07., Commit `5d9ff3c`)

- brauchBAR = **Webseiten, Konzepte, Werkzeuge**. Art `webseite` wandert komplett von der lesBAR in die brauchBAR — gleicher kind-Wert, keine Datenmigration. Dropdown-Label im Studio: „Webseite (BrauchBAR)".
- Alle kind-Filter angepasst (Studio-Struktur, brauchbar/lesbar Index + Detail, Startseiten-Router, erkennBAR/Startseiten-Beschreibungen). Rubriken-Reihenfolge auf /brauchbar/ fix: Webseiten → Konzepte → Werkzeuge.
- 308-Redirects in `vercel.json` für die zwei umgezogenen Einträge (`/lesbar/anthroposophie-lebensnah/`, `/lesbar/wortgetreu-com/` → `/brauchbar/…`).
- Studio am 19.07. deployt (Schema-Manifest verifiziert).

### „gelogen" im Sanity-Dashboard (Katharinas Frage 18.07., 20:40)

- Kein Inhalt heißt so: Volltext-Suche über Dataset (inkl. Drafts), Dokument-Historie des Dante-Eintrags und Asset-Dateinamen ergab **null Treffer** für „gelogen". Der Dante-Eintrag heißt korrekt „Dante mal anders".
- Das Wort erscheint nur in der „Zuletzt angesehen"-Liste des sanity.io-Dashboards (Mobile), die auch sonst falsche Titel zeigt (brauchBAR-Einträge erscheinen dort als „Konzept"/„Werkzeug" statt mit echtem Titel). Anzeige-Bug des Sanity-Dashboards, nicht unserer Inhalte — Studio und Website sind sauber.

---

## STAND 18.07.2026 — hörBAR-Kennzeichnung live, lesBAR-Beschreibung bereinigt

### hörBAR: Episoden-Art (Katharinas Wunsch, PR #7, Commit `8e00a46`)

- **Neues Pflichtfeld `episode.kind`** („Art", Radio): Gespräch · Vortrag · Gedicht · Lied · Reflexion *(Default: Reflexion)* — analog zu Notiz/Poesie in der schreibBAR.
- **Anzeige:** farbiges `entry__tag`-Label über dem Titel in der hörBAR-Liste + Art in der Eyebrow-Zeile und Meta-Description der Detailseite. Art-Farben in `global.css` *(Gespräch = Bergsee-Türkis, Vortrag = Plum, Gedicht = Champagne, Lied = Frühlingsblatt, Reflexion = Berry-Plum)*.
- **Abwärtskompatibel:** Episoden ohne gesetzte Art zeigen einfach kein Label. Eyebrow/Description werden aus vorhandenen Teilen zusammengesetzt *(behebt auch das hängende „·" bei `platform: null`)*.
- **Art-Filter** (Commit `164c5bd`): Pillen-Filterleiste über hörBAR- und schreibBAR-Liste, erscheint automatisch ab 20 Einträgen und mindestens zwei Arten.
- **Studio deployt am 18.07.** — das Art-Feld ist im Live-Studio verifiziert *(create-schema.json im Studio-Static enthält `episode.kind` mit allen 5 Optionen)*.
- **Für Katharina offen:** Die 4 bestehenden Episoden einmal im Studio öffnen und die Art anklicken — dann erscheint das Label auf der Site.

### lesBAR: Beschreibung ohne Filme/Podcasts (PR #8)

- Filme und Podcasts leben in der hörBAR — die lesBAR-Beschreibungen erwähnen sie nicht mehr: Startseiten-Raumkarte, lesBAR-Seite (Meta-Description + Intro) und erkennBAR-`defaultDescription`.
- Die Rubriken „Filme"/„Podcasts" **innerhalb** der lesBAR-Liste bleiben — vorhandene Einträge dieser Art werden weiterhin angezeigt.

## STAND 29.06.2026 — PRODUKTIV auf reise-zueinander.de

Site ist live unter der finalen Domain. Domain-Umzug + DSGVO-Härtung + Katharinas erstes Feedback sind umgesetzt, in `main` gemergt und live verifiziert.

### Domains / Routing (alle live)

- **reise-zueinander.de** — Hauptadresse (Production). Canonical/OG/Sitemap/robots zeigen hierhin.
- **katharina-offenborn.de** — 308-Redirect auf reise-zueinander.de (pfad-erhaltend).
- **www.** beider Domains — 308-Redirect auf reise-zueinander.de.
- **oasen-finder.vercel.app** — läuft weiter, Canonical zeigt aber auf reise-zueinander.de.
- **DNS bei Infomaniak** (Nameserver dort lassen — sonst Mail kaputt!): `A @ 216.198.79.1`, `www CNAME cname.vercel-dns.com`. Vercel empfiehlt kosmetisch ein neues www-Ziel (`52d7b88e07efd895.vercel-dns-017.com`); das alte funktioniert dauerhaft weiter.

### DSGVO-Härtung (Commit `17db52f`)

- Google Fonts **self-hosted** via `@fontsource` (kein Google-Aufruf mehr).
- Medien-Player (`MediaLink.astro`) auf **Klick-zum-Laden** — kein Drittanbieter-Embed/Cookie vor aktivem Klick.
- Datenschutzseite angepasst; `vercel.json` nutzt CSP `frame-ancestors` (statt `X-Frame-Options`), damit das Sanity-Presentation-Iframe lädt.

### Katharina-Feedback (Commit `ae99fb3`)

- **Gedichte** (note, Art=Poesie): eigenes Layout + 4 Backend-Felder `poemAlign/poemLineSpacing/poemImageGap/poemItalic` (nur bei Poesie sichtbar); Poem-CSS im PortableText-Renderer.
- **brauchBAR**: eigener Studio-Menüpunkt (`resource` mit `kind in [konzept, werkzeug]`) + Vorlage `resource-brauchbar`; lesBAR zeigt nur noch die übrigen Quellen; `resource.kind` Default `buch`.
- **machBAR**: neues Event-Feld `format` (Vor Ort / Online-Treffen).
- Irreführenden Leerzustand „… sobald Sanity verbunden ist" in allen 5 Räumen umformuliert.

### Studio-Deploy — WICHTIG für nächstes Mal

Studio: **werkstatt-gemeinschaft.sanity.studio** (Org Intuitivmedia `ow7ACwTD3`, Projekt `z6eclgt8`).
- **Der per `sanity login` (Google) eingeloggte Account hat KEINEN Zugriff** auf z6eclgt8 (nur 2 Projekt-Member). Deploy daher über **Deploy-Token**: manage.sanity.io → Projekt z6eclgt8 → API → Tokens (Rolle „Deploy Studio"/Administrator) → `SANITY_AUTH_TOKEN=… npx sanity deploy` aus `astro/sanity`.
- **react-is-Fix (Commit `6cb127c`):** `astro/sanity` brauchte `react-is` (Peer von `@sanity/ui` 2.x), sonst bricht `sanity build`.

### Noch offen (optional, nicht dringend)

- **Resend/E-Mail:** Mitkommen-Empfänger-Default = `katharina.offenborn@googlemail.com`. Echte Zustellung braucht verifizierte Resend-Absender-Domain; aktuell Sandbox/Log-Modus *(siehe Schritt 2 im historischen Teil)*.
- **Google Search Console:** neue Property `reise-zueinander.de` + Sitemap einreichen.
- **www „DNS Change Recommended":** kosmetisch (siehe oben).
- **Sanity-Dataset:** ggf. alte absolute `oasen-finder.vercel.app`-Links im Content prüfen.

---

## Wo wir stehen — Stand 12. Mai 2026 (historisch)

### Live auf [oasen-finder.vercel.app](https://oasen-finder.vercel.app)

- **23 Astro-Pages**, Sanity-Content im Build, Leaflet-Karte auf bewegBAR, Mood-Banner auf jeder Hauptseite
- **Brand:** werk**STATT** Gemeinschaft *(Akzent in Honig-Gold auf STATT, werk + Gemeinschaft in Aubergine italic)*
- **Hero-Eyebrow:** „Gemeinschafts**WERK** statt allein unterwegs"
- **Hero-Subtitle:** „Reisen · Werkstätten · Notizen · Fotos"
- **BAR-Namen** überall klein-Anfang: schreibBAR · bewegBAR · machBAR · lesBAR · hörBAR · erkennBAR
- **Newsletter-Block** *(Substack)* auf Landing + erkennBAR
- **Mitkommen-Form** mit echtem Server-Submit *(Vercel-Function, Resend-ready, aktuell Log-Modus)*
- **Footer:** Scroll-to-Top · Kontakt-Formular-Link · Telegram-Link *(wenn in Sanity gesetzt)* · Webdesign-Credit
- **Legal-Pages** *(Impressum + Datenschutz)* mit echten Daten + Volltext-Erklärung aller genutzten Dienste

### Sanity-Studio live

- **<https://werkstatt-gemeinschaft.sanity.studio/>** *(Project z6eclgt8)*
- **Tabs pro Eintrag:** Inhalt · Bilder & Anhänge · Mehr *(plus „Anmeldung & Kosten" bei MachBAR)*
- **Live-Vorschau-Tab:** zweiter Top-Level-Tab „Vorschau" neben „Inhalte" — iframe der Site, Click-to-Edit
- **Mehrsprachigkeit** *(DE/FR/EN):* DE prominent, FR + EN in zugeklappten Übersetzungs-Fieldsets
- **Icons** pro Bereich in Sidebar + Cards + Breadcrumbs
- **Upload:** Bilder in jedem Format *(JPEG/PNG/WebP/AVIF/HEIC)*, Dokumente als PDF/Word/ODT/TXT
- **MediaLink-Embed:** YouTube/Vimeo/Spotify/Apple Music/SoundCloud/Telegram-URLs werden automatisch eingebettet

### Auto-Build-Hook aktiv

Katharina drückt im Studio „Publish" → Vercel-Webhook → Site re-deployt in ~60–90 s.

### Cutover-Historie *(damit zukünftige Sessions die Story kennen)*

- ❌ Versuch 1 (`6df0315`): pnpm 10 → URLSearchParams-Bug
- ❌ Versuch 2 (`1d2b285`): pnpm 10 + Node 22 fixiert → selber Fehler
- ✅ Versuch 3 (`1bd9891`): Auf **npm + `package-lock.json` eingecheckt** → READY

### Brand-Iterationen-Historie

- WERKstatt → werkSTATT *(Akzent verschoben weil „Werk statt Gemeinschaft" falsch gelesen wurde)*
- BAR-Namen Groß-Anfang → klein-Anfang
- Hero-Eyebrow ohne „Miteinander vereinBAR — "
- Logo-Farben: erst grün-gold → dann aubergine-gold *(ruhiger, eine Akzentfarbe)*
- Logo-Schrift bolder *(weight 500 für werk + Gemeinschaft)*
- Page-Titel der BAR-Pages: H1 = bar-Name, alter H1 als italic-Untertitel

---

## 1. Vercel-Analytics aktivieren

Beide Pakete sind installiert und im BaseLayout eingebunden, aber **im Dashboard noch nicht aktiviert**:

1. <https://vercel.com/bolteds-projects/oasen-finder/analytics>
2. Wenn dort „Enable Analytics"-Button steht: einmal klicken
3. Fertig. Daten sammeln läuft automatisch.

*(Speed Insights bewusst nicht aktiv — Hobby-Plan beschränkt auf 1 Projekt, wird woanders verbraucht.)*

---

## 2. Resend einrichten — Mitkommen-Mails wirklich versenden

**Vercel-Function `/api/mitkommen.ts`** ist live. Solange `RESEND_API_KEY` fehlt: Log-Modus *(Anfrage in Function-Logs, User bekommt „Danke")*. Aktivierung:

1. **Resend-Account anlegen** — <https://resend.com> *(free 3000 Mails/Monat, 100/Tag)*
2. **API-Key generieren:** Settings → API Keys → „Create API Key" → Name `werkstatt-gemeinschaft-prod` → „Sending access"
3. **Domain verifizieren** *(empfohlen, sobald Domain feststeht)* — Resend → Domains → Add → DNS-Einträge bei Registrar setzen
4. **In Vercel-Project-Settings → Environment Variables** *(Production)*:
   - `RESEND_API_KEY` = `re_xxxxx...`
   - `MITKOMMEN_TO` = `katharina.offenborn@googlemail.com` *(echte Empfänger-Mail, schon in Sanity contact gespeichert)*
   - `MITKOMMEN_FROM` = `mitkommen@<DOMAIN>` *(sobald Domain verifiziert; bis dahin `onboarding@resend.dev`)*
5. **Re-deploy auslösen** *(Push oder Vercel-Dashboard „Redeploy")*
6. **Test:** Formular auf <https://reise-zueinander.de/mitkommen/> → Mail muss bei `MITKOMMEN_TO` ankommen

Anti-Spam ist eingebaut: Honeypot-Feld, Mail-Format-Check, Pflichtfeld-Validation, Reply-To korrekt.

---

## 3. Mail an Katharina — was noch offen ist

Strukturierte Liste in **`KATHARINA-FRAGEN.md`** — direkt copy-paste-fertig. Aktuelle offene Punkte:

1. **Substack-Publikation-URL bestätigen** *(`substack.com/@katharinaoffenborn` ist Profil, nicht Publication — `katharinaoffenborn.substack.com` ist Annahme)*
2. **denkBAR + brauchBAR** — eigene Räume oder Sub-Bereich?
3. **Eigene Inhalte** *(Bio, Notizen, Stationen)*
4. **„Wir reisen"** — wer ist „wir"? *(Katharina + Carla bestätigt; Philippe + andere offen)*
5. **Upload-Format-Wünsche** *(Audio/Video direkt-Upload?)*
6. **Telegram-Channel-URL** *(optional, blendet Footer-Link sonst aus)*
7. **Domain** — wie soll die Adresse heißen?

---

## 4. Strategische Items

### DSGVO-Generator-Run

`/impressum/` und `/datenschutz/` sind als **fertige Volltexte** angelegt mit echten Daten *(Anschrift + Mail + alle Dienste explizit benannt — Vercel, Sanity, Resend, OSM, Unsplash, Google Fonts, Vercel Analytics)*. Vor Public-Launch:

- Mit eRecht24-Generator gegenprüfen → ggf. Lücken füllen
- Insbesondere: USt-IdNr, Haftungs-Klauseln Sonderfälle, Newsletter-spezifische Klauseln *(sobald Newsletter live)*

### Bus-Faktor

- **info@intuitive-fotografie.de als zweiter Sanity-Admin** → Bus-Faktor abgesichert *(falls User-Account mal weg ist)*
- **Domain bei Registrar in Katharinas Namen** anlegen, sobald Domain entschieden

### A11y-Audit + Mobile-Test

- Lighthouse-Run auf alle Routes
- Kontrast-Check Aubergine-Linen + Gold-CTAs
- Italic-Cormorant in 14-16 px lesbar? *(Ende-60-Zielgruppe)*
- Touch-Targets ≥ 44 px
- **Mit Katharina am Tablet testen** *(empfohlen)*

### Hub-Logik *(Backlinks setzen)*

- wortgetreu.com → Link auf werkSTATT-Site in deren Header/Footer
- anthroposophie-lebensnah → analog
- YouTube/Spotify/Apple-Music-Profile *(sobald aktiv)* → Bio-Link
- Substack-Profil → Description-Link

---

## Wichtige Konventionen

### Kommunikation

- **Du-Form** zwischen Auftraggeber und Katharina
- Tone: **warm + klar**, nicht Berater-Modus *(siehe `KATHARINA-ANTWORTEN.md` — Tone-Direktive)*
- Plus: Katharina sucht / fragt / erforscht — keine Selbst-Inszenierung als Expertin

### Commits

- **Deutsche Commit-Messages** mit thematischem Präfix *(„Mitkommen:", „Brand:", „Studio:")*
- **Atomare Commits** bei klaren Meilensteinen
- Co-Author-Footer bei Claude-Commits
- **Nie pushen auf `main` ohne expliziten Auftrag**

### Brand-Farben

- `--accent-gold: #c08538` — STATT-Akzent, CTAs, „Gemeinschaft?" im Hero, WERK im Eyebrow
- `--accent-warm: #c98a4a` — Detail-Eyebrows, Links, Hover-States
- `--accent: #a8392b` — Clay-Rot, reserviert für sehr seltene Aktionen
- `--text-primary: #2c2530` — warm Aubergine *(werk + Gemeinschaft im Logo)*

### Wichtigste „Don'ts" *(aus CONTEXT.md, Detail dort)*

- Kein „Gelaber"
- Kein „uns/wir" Auftraggeber↔Katharina
- Kein „Sanity" im Fragebogen oder Texten an Katharina — „Backend"
- **„Niemals reflexartig vereinfachen"** — Iterationen sind oft absichtlich
- Kein Push auf main ohne Auftrag

---

## Wichtige Links

| | URL |
|---|---|
| Live-Site | <https://reise-zueinander.de> *(alt: oasen-finder.vercel.app)* |
| GitHub | <https://github.com/restitutio777/oasen-finder> |
| Vercel-Dashboard | <https://vercel.com/bolteds-projects/oasen-finder> |
| Vercel-Analytics | <https://vercel.com/bolteds-projects/oasen-finder/analytics> |
| Vercel-Env-Vars | <https://vercel.com/bolteds-projects/oasen-finder/settings/environment-variables> |
| Sanity-Studio | <https://werkstatt-gemeinschaft.sanity.studio/> |
| Sanity-Dashboard | <https://www.sanity.io/manage/project/z6eclgt8> |
| Resend *(zu erstellen)* | <https://resend.com> |
| Substack-Profil | <https://substack.com/@katharinaoffenborn> |

## Konten + Zugänge

| Tool | Status | Owner |
|---|---|---|
| GitHub | `restitutio777/oasen-finder` | Auftraggeber |
| Vercel | `bolteds-projects/oasen-finder` | Auftraggeber |
| Sanity | Project `z6eclgt8`, Org `ow7ACwTD3` (Intuitivmedia) | Auftraggeber (Owner), Katharina (Editor) — Status quo bleibt |
| Substack | `katharinaoffenborn` | Katharina |
| Resend | nicht eingerichtet | offen |
| Domain | nicht entschieden | offen |
| Vercel Analytics | aktivieren ausstehend | offen |

## Lokale Entwicklung

```bash
# Astro-Frontend
cd astro && npm install && npm run dev        # http://localhost:4321

# Sanity-Studio (lokal mit Vision-Tool)
cd astro/sanity && pnpm install && pnpm dev   # http://localhost:3333

# Functions-Test (Mitkommen lokal mit echtem POST)
npx vercel dev                                # im Repo-Root, simuliert /api/mitkommen

# Demo-Content neu importieren
cd astro/sanity && pnpm dlx sanity@latest dataset import seed/demo.ndjson --dataset production --replace
```

## Code-Architektur — was wo

```
oasen-finder/
├── astro/                          Astro-Frontend
│   ├── src/
│   │   ├── pages/                  Routes (Landing, 7 BAR-Pages, Legals, FR/EN-Stubs)
│   │   ├── layouts/BaseLayout.astro
│   │   ├── components/
│   │   │   ├── Header.astro        Brand + Top-Nav + Hamburger
│   │   │   ├── Footer.astro        Brand + Nav + Telegram-Link + Scroll-to-Top
│   │   │   ├── PortableText.astro  Rich-Text-Renderer
│   │   │   ├── SanityImage.astro   srcset + auto-format
│   │   │   ├── PageBanner.astro    Unsplash-Mood-Banner
│   │   │   ├── MapBewegBAR.astro   Leaflet-Karte
│   │   │   ├── MediaLink.astro     Auto-Embed (YT/Vimeo/Spotify/Apple/SoundCloud/Telegram)
│   │   │   └── NewsletterBlock.astro  Substack-Embed
│   │   ├── lib/sanity.ts           Client + Helper
│   │   └── styles/global.css       Brand-CSS (1945+ Zeilen)
│   ├── sanity/                     Sanity-Studio (Subfolder)
│   │   ├── sanity.config.ts        Studio-Config + Presentation Tool
│   │   ├── schemas/                7 Document-Types + i18n
│   │   └── seed/demo.ndjson        Demo-Inhalte
│   └── package.json                + package-lock.json (eingecheckt)
├── api/mitkommen.ts                Vercel-Function (Resend-Mail-Versand)
├── vercel.json                     Build-Config (npm)
├── CONTEXT.md                      Projekt-Kontext (lies dies zuerst)
├── KATHARINA-ANTWORTEN.md          Alle Antworten + Tone-Direktive
├── KATHARINA-FRAGEN.md             Offene Fragen — Mail-Vorlage
├── NEXT-SESSION.md                 Dies hier
├── PLANUNG.md                      Strategische Roadmap (älter)
├── FRAGEBOGEN-KATHARINA.md         Original-Fragebogen
└── README.md                       Tech-Übersicht
```

---

## Was du der neuen Session sagen kannst

> Lies in dieser Reihenfolge: `CONTEXT.md`, `KATHARINA-ANTWORTEN.md`, `KATHARINA-FRAGEN.md`, `NEXT-SESSION.md`.
> Top-Schritt: Vercel-Analytics aktivieren *(1 Klick)*, dann Resend einrichten.

Damit ist sie/er innerhalb von ~5 Minuten orientiert.
