# Oasen Finder

Eine deutschsprachige Recherche zu Gemeinschaftsorten im DACH-Raum — Ökodörfer, Cohousing-Projekte, spirituelle Höfe. Sichtbarer Prototyp einer kuratierten Sammlung.

> *Orte, an denen sich etwas verschiebt.*

## Stand

Visueller Entwurf als Single-Page (`index.html`). Statisch, ohne Build-Step, sofort lauffähig. Schriften: **Cormorant Garamond** (Display) + **Inter** (Text). Palette: Linen-Cream, Sage, warmes Aubergine-Anthrazit, Clay, Mauve-Rosé.

## Lokal entwickeln

Es genügt ein einfacher Static-Server:

```bash
python3 -m http.server 4321
# → http://localhost:4321
```

Oder, falls vorhanden:

```bash
npx serve .
```

## Deploy

Über Vercel als Static-Site — `vercel.json` ist im Repo. Push auf `main` → automatischer Deploy.

## Struktur

```
.
├── index.html        # die gesamte Seite (HTML + CSS + minimales JS)
├── favicon.svg
├── vercel.json
└── README.md
```

## Inhalte ändern

Alle Texte und Bilder leben direkt in `index.html` — auffindbar über Sektions-Kommentare (`<!-- HERO -->`, `<!-- FEATURED PLACE -->`, `<!-- VOICES -->` …). Bilder kommen von Unsplash, jede `img src` enthält die Photo-ID.

Geplant für Phase 2: Migration nach Astro mit typsicheren Content-Files (`/src/content/*.ts`). Phase 3: Sanity als Headless-CMS.

## Out of Scope (bewusst)

- Kein CMS im Prototyp
- Kein Auth, keine Mitgliederbereiche
- Keine Mehrsprachigkeit
- Keine Buchung / Zahlung
- Keine Suche

## Lizenz

Code: MIT — Inhalte und Fotografien folgen den jeweiligen Lizenzen (Unsplash). Vor Veröffentlichung mit den dargestellten Gemeinschaften abstimmen.
