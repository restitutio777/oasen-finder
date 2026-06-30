# WERKstatt Gemeinschaft — Astro-Frontend

Phase-1-Skelett des Multi-Page-Frontends für Katharinas Site.
Sitzt **parallel** neben dem statischen `index.html` im Root —
Vercel deployt aktuell weiter die statische Version, dieser Folder
ist Vorbereitung für den späteren Cutover.

## Status

| | Stand |
|---|---|
| **Setup** | ✅ Astro 5 + TypeScript + i18n-Konfig |
| **Sanity-Schemas** | ✅ 7 Dokumenttypen + i18n-Helper + Studio-Config |
| **Sanity-Client** | ✅ Setup im Code, wartet auf `.env`-Werte |
| **Pages** | ✅ Skelette für alle BARs (Listen + Detail) + Legal + i18n-Stubs |
| **CSS-Migration** | ✅ `global.css` aus `index.html` extrahiert |
| **Sanity-Projekt** | ✅ `z6eclgt8` *(Org: Intuitivmedia, Plan: Growth Trial)* — Ownership-Transfer auf Katharina später |
| **Studio deployt** | ✅ <https://werkstatt-gemeinschaft.sanity.studio/> |
| **Content** | ✅ 10 Demo-Records importiert ins `production`-Dataset |
| **Astro-Build** | ✅ Test-Build durch (21 Pages, alle Detail-Routen aus Sanity gerendert) |
| **PortableText-Renderer** | ⏳ Folge-Commit *(aktuell Platzhalter)* |
| **Leaflet-Karte** *(BewegBAR)* | ⏳ Folge-Commit |
| **Formular-Submit** *(Mitkommen)* | ⏳ noch mailto-Fallback |
| **Live-Cutover** | ⏳ wenn alles oben grün ist |

## URL-Architektur

```
/                          Landing — Übersicht aller BARs
/erkennbar/                Bio (singleton)
/schreibbar/               Notizen-Liste
/schreibbar/[slug]/        Einzelne Notiz
/bewegbar/                 Karte + Stationen
/bewegbar/[slug]/          Einzelne Station
/machbar/                  Werkstatt-Termine
/machbar/[slug]/           Einzelner Termin
/lesbar/                   Bibliothek (gruppiert nach Art)
/lesbar/[slug]/            Einzelner Eintrag
/hoerbar/                  Episoden-Liste
/hoerbar/[slug]/           Einzelne Episode
/mitkommen/                Kontakt-Formular
/danke/                    Bestätigungs-Seite
/impressum/                Pflicht-Legal
/datenschutz/              Pflicht-Legal
/fr/                       Französische Hauptseite (Stub)
/en/                       Englische Hauptseite (Stub)
```

**i18n:** Deutsch ist Default ohne Sprach-Präfix, `/fr/...` und `/en/...`
als Sub-Pfade. Astro-Config: `prefixDefaultLocale: false`.

## Sanity-Setup

**Projekt schon angelegt:**
- Project ID: `z6eclgt8`
- Organization: Intuitivmedia (`ow7ACwTD3`)
- Plan: Growth Trial
- Dashboard: <https://www.sanity.io/organizations/ow7ACwTD3/project/z6eclgt8>

Diese Werte sind als Defaults im Code (`astro/src/lib/sanity.ts` und
`astro/sanity/sanity.config.ts`) hardcoded — kein `.env` für den
Anfang nötig.

### Setup-Strategie für späteren Transfer

**Phase A *(jetzt, Auftraggeber-Account)*:**
Konto unter deiner Mail, Projekt liegt unter Intuitivmedia-Org.
Schemas + Studio + Inhalte hier setzen.

**Phase B *(wenn Katharina soweit ist)*:**
1. Katharina registriert sich auf [sanity.io](https://www.sanity.io/) mit ihrer Mail
2. Im Project Settings → Members → Add Member → Katharinas Mail mit Rolle "Administrator"
3. Project Settings → Transfer ownership → Katharinas Account auswählen
4. Resultat: **Sie = Owner**, du = Admin (Backup) — idealer Bus-Faktor

### Schemas deployen

```bash
cd astro/sanity
pnpm install
pnpm dev          # lokales Studio auf http://localhost:3333
                  # → einmal einloggen, dann ist der CLI-Cache da

pnpm deploy       # ins Sanity-Cloud-Hosting
                  # → werkstatt-gemeinschaft.sanity.studio (oder ähnlich)
```

### Demo-Content importieren

10 Records (Bio, 3 Notizen, 2 Stationen, 1 Termin, 2 Quellen, Formular-Config)
liegen in `astro/sanity/seed/demo.ndjson` bereit:

```bash
cd astro/sanity
pnpm dlx sanity@latest dataset import seed/demo.ndjson production --replace
```

Damit ist der Dataset sofort befüllt, das Astro-Frontend hat etwas zu zeigen.
Siehe `astro/sanity/seed/README.md` für Details zu jedem Record.

### Inhalts-Pflege durch Katharina

Sobald Studio deployt ist, kann sie sich einloggen und Inhalte ergänzen:
- **Fotos** in die Records ziehen (Drag & Drop)
- **FR/EN-Übersetzungen** schrittweise ergänzen
- **Mehr Stationen, Notizen, Termine** anlegen

Mindest-Content für Soft-Launch *(strategisches Item 5 in CONTEXT.md)*:
- erkennBAR: ✅ Bio drin, Foto fehlt
- 3-5 SchreibBAR-Notizen: ✅ 3 drin
- 2-3 BewegBAR-Stationen: ✅ 2 drin
- 1-2 LesBAR-Einträge: ✅ 2 drin
- Mitkommen-Mail-Adresse: ✅ `kontakt@reise-zueinander.de` (Empfänger via Vercel-Env `MITKOMMEN_TO`)

## Lokale Entwicklung

```bash
# Im Repo-Root:
cd astro
pnpm install
pnpm dev          # Astro-Dev-Server auf http://localhost:4321

# Studio parallel (separater Terminal):
cd sanity
pnpm install
pnpm dev          # Sanity-Studio auf http://localhost:3333
```

## Build & Cutover

Build:
```bash
cd astro
pnpm build        # → astro/dist/
```

Cutover-Plan *(wenn Sanity + Content + alle TODOs durch)*:
1. Vercel-Build-Config umstellen *(`vercel.json` oder Project-Settings)*:
   - Root-Directory: `astro/`
   - Build-Command: `pnpm build`
   - Output: `dist`
2. Altes `index.html` aus dem Repo entfernen *(oder als `index.legacy.html`
   archivieren für Vergleich)*
3. Live-Site umgestellt — Vercel-Domain bleibt.

## Was noch zu tun ist *(in Reihenfolge)*

1. **Sanity-Account anlegen** *(15 Min, in Katharinas Namen)*
2. **`pnpm install` in `astro/` und `astro/sanity/`** *(dependencies ziehen)*
3. **Erstes lokales `pnpm dev` testen** — Skelette müssen rendern, dann Build
4. **PortableText-Renderer** als Astro-Komponente *(für body, reflection,
   description, note, summary aus Sanity)*
5. **Leaflet-Karte** für BewegBAR — Client-Component mit OSM-Tiles
6. **Formular-Backend:** Vercel-Function oder Netlify-Forms oder
   Buttondown-Integration *(strategisches Item 2 — Newsletter-Tool-Wahl)*
7. **Inhalte einpflegen** — gemeinsam mit Katharina
8. **A11y + Lighthouse-Audit** vor Live-Cutover *(strategisches Item 5)*
9. **DSGVO-konformes Impressum + Datenschutz** *(Generator)* *(Item 3)*
10. **Live-Cutover** — Vercel-Config umstellen, Smoke-Test

## Wichtige Konventionen

- **Bildschirm-Inhalte** kommen aus Sanity. Code-Layout ist Brand,
  Inhalt ist Daten. Brand-Änderungen → Code. Inhaltsänderungen → Sanity.
- **i18n:** alle inhaltlichen Felder als `i18nString` oder `i18nText`.
  Katharina füllt deutsch zuerst, FR/EN folgen.
- **Slugs in Sanity** werden aus dem deutschen Titel generiert.
- **PortableText** für Fließtext *(nicht Markdown)* — erlaubt Bilder,
  Links, Hervorhebungen direkt im Editor.
- **`.werk-accent`-Klasse** für die WERK-Silbe überall einsetzbar
  *(definiert in `global.css`)*.

## Brand-Referenz *(siehe CONTEXT.md im Repo-Root)*

- **Brand:** WERKstatt Gemeinschaft
- **Claim:** Miteinander vereinBAR — GemeinschaftsWERK statt allein unterwegs
- **Akzent-Familie:**
  - `--accent-gold: #c08538` *(Hero-Frage, WERK-Silbe, CTAs)*
  - `--accent-warm: #c98a4a` *(Brand-Schrift „Gemeinschaft", Tags, Eyebrows)*
  - `--accent: #a8392b` *(reserviert für seltene Action-Anker)*
