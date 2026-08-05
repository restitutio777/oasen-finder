# werkSTATT-Gemeinschaft (oasen-finder)

Astro-Frontend + eingebettetes Sanity Studio. Live über Vercel, Studio unter
https://werkstatt-gemeinschaft.sanity.studio/

## Struktur

- `astro/` — Astro-Site (eigenes npm-Projekt, eigenes `node_modules`)
- `astro/sanity/` — Sanity Studio (SEPARATES npm-Projekt mit EIGENEM `node_modules`
  und eigenem `package.json`; projectId/dataset in `astro/sanity/sanity.config.ts`)

## Sanity Studio deployen

Aus dem Studio-Ordner, über dessen eigenes npm:

```bash
cd astro/sanity
npm run deploy
```

Grund: Die `sanity`-CLI liegt nur in `astro/sanity/node_modules/.bin/`. Ein direktes
`sanity deploy` schlägt fehl (`command not found`), weil die CLI nicht global
installiert ist — immer über `npm run` im `astro/sanity/`-Ordner gehen, damit die
lokale CLI auf den PATH kommt. Die Wrapper `npm run sanity:deploy` / `sanity:dev`
in `astro/package.json` machen intern `cd sanity && npm run …` und funktionieren
ebenfalls aus `astro/`.

Bei Login-Frage: `sanity login` im `astro/sanity/`-Ordner mit dem Account, zu dem
dieses Projekt gehört (nicht automatisch der zuletzt eingeloggte).

## Wichtig

- Schema-Änderungen (`astro/sanity/schemas/`) werden im Studio erst nach einem
  Studio-Deploy sichtbar — Vercel-Deploy des Codes reicht dafür NICHT.
- Default-Branch-Workflow: direkt auf `main` arbeiten.

## „Katharina hat veröffentlicht, aber nichts erscheint"

Fast immer ein **fehlgeschlagener Build**, nicht der Webhook. Die Site ist
statisch (`output: 'static'`) — ein Build-Fehler friert den kompletten
Live-Stand ein, während im Studio alles normal aussieht. Reihenfolge:

1. Build lokal reproduzieren — das ist der schnellste Beweis:
   ```bash
   cd astro && npm install --legacy-peer-deps && npm run build
   ```
2. Dataset gegen den Live-Stand halten (production ist public, kein Token):
   ```bash
   curl -s --get "https://z6eclgt8.api.sanity.io/v2024-03-01/data/query/production" --data-urlencode 'query=*[_type == "note"] | order(_createdAt desc)[0...5]{_createdAt, "slug": slug.current}'
   ```
   HTTP-Header taugen dafür nicht: `last-modified` zeigt die CDN-Cache-Füllung,
   nicht das Deploy-Alter. Nur der ausgelieferte Inhalt zählt.

Am 05.08.26 war die Ursache ein Google-Photos-Link im Slug-Feld: Astro baut aus
dem Slug den Dateipfad, Schrägstriche darin lassen `getStaticPaths` abstürzen.
Seither fängt `astro/src/lib/slug.js` (`withSafeSlugs()`) das ab — auf Detail-
UND Listenseiten immer dieselbe Funktion benutzen, sonst zeigt die Liste auf
eine Adresse, die es nicht gibt.

<!-- cloud-local-sync -->
## Cloud ↔ Local: immer überall up to date

Der Betreiber arbeitet in diesem und anderen Projekten mal lokal, mal als Cloud-Session (Claude Code on the web). Beide Seiten sollen immer denselben Stand haben:

- Am Session-Start `git pull` — auf dem neuesten Stand beginnen.
- Am Ende jeder Arbeitsphase / vor Sessionende alles committen und pushen. Nichts Wichtiges nur uncommitted lokal liegen lassen.
- Cloud-Sessions sehen NUR den Git-Stand: keine uncommitteten Änderungen, NICHT das lokale Auto-Memory unter `~/.claude/`. Was die andere Seite wissen muss, gehört committet in versionierte Dateien (CLAUDE.md, ggf. `memory/`, Docs, Code).
