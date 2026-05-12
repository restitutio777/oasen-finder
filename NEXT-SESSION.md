# Nächste Session — Wiedereinstieg

*Hand-off vom 12. Mai 2026, spät. Site visuell + funktional rund.*

## In 30 Sekunden: was zu tun ist

1. **Vercel-Analytics aktivieren** — 1 Klick im Dashboard *(Schritt 1 unten)*
2. **Resend einrichten** — Account + 3 Env-Variables → Mitkommen-Mails gehen wirklich raus *(Schritt 2)*
3. **Mail an Katharina** mit den offenen Fragen *(Schritt 3 — Vorlage in `KATHARINA-FRAGEN.md`)*
4. **Domain entscheiden + setup** sobald Katharina sich entschieden hat
5. **Strategische Items** *(DSGVO-Generator, Bus-Faktor, A11y, Hub-Logik)*

## Wo wir stehen — Stand

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
6. **Test:** Formular auf <https://oasen-finder.vercel.app/mitkommen/> → Mail muss bei `MITKOMMEN_TO` ankommen

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
| Live-Site | <https://oasen-finder.vercel.app> |
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
