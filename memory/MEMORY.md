# MEMORY — werkSTATT Gemeinschaft / reise-zueinander.de

Kompaktes Langzeitgedächtnis. Destilliert, nicht protokolliert. Details stehen in
`NEXT-SESSION.md` (chronologische Stände, neueste oben), `CONTEXT.md` (Projekt-
Historie) und `CLAUDE.md` (Arbeitsanweisungen fürs Repo). Diese Datei ist die
Einstiegsseite: erst hier lesen, dann gezielt nachschlagen.

*Stand: 05.08.2026*

## Projektziel

Website für Katharina Offenborn: Reisen zu Gemeinschaftsorten, Werkstatt-Termine,
Notizen. Sieben „BAR"-Räume (schreibBAR, machBAR, bewegBAR, hörBAR, lesBAR,
brauchBAR, wunderBAR, dazu denkBAR und erkennBAR). Sie pflegt alles selbst im
Sanity Studio, meist vom Handy. Das ist die wichtigste Randbedingung: Jede
Entscheidung wird daran gemessen, ob sie für eine nicht-technische Person am
Telefon funktioniert.

## Aktueller Stand

- Produktiv auf https://reise-zueinander.de (Vercel, statischer Astro-Build).
- Studio: https://werkstatt-gemeinschaft.sanity.studio, Sanity-Projekt `z6eclgt8`,
  Dataset `production`.
- Publish im Studio löst per Webhook einen Vercel-Build aus, ~1 bis 2 Minuten bis
  live.
- Mitkommen-Formular versendet echt via Infomaniak-SMTP.

## Entscheidungen mit Begründung

- **Statischer Output** (`output: 'static'`). Kein Token im Frontend, schnell,
  billig. Preis: Ein Build-Fehler friert den kompletten Live-Stand ein, ohne dass
  im Studio irgendetwas auffällt. Siehe Stolpersteine.
- **`useCdn: false`** im Sanity-Client. Der Build startet Sekunden nach dem
  Publish, das API-CDN lieferte da noch alte Daten, mit inkonsistentem Ergebnis
  zwischen zwei Queries desselben Builds (404 auf frische Detailseiten). Nicht
  zurückstellen, die Begründung steht ausführlich in `astro/src/lib/sanity.ts`.
- **Slug wird nie roh in eine Route gegeben** (`astro/src/lib/slug.js`,
  `withSafeSlugs()`). Ein einzelner kaputter Feldwert darf die Site nicht
  lahmlegen. Auf Detail- **und** Listenseite immer dieselbe Funktion, sonst zeigt
  die Liste auf eine Adresse, die die Route nicht kennt.
- **Studio-Validierungen als Warnung, nicht als Fehler.** Ein blockierter
  „Veröffentlichen"-Button wirkt am Handy wie ein kaputtes Backend. Lieber
  automatisch reparieren und per Toast erklären.
- **„Zuletzt veröffentlicht" sortiert nach `_createdAt`**, nicht `_updatedAt`.
  Eine Tippfehler-Korrektur soll einen alten Eintrag nicht wieder nach oben
  holen. `isEventArchived()` nutzt bewusst weiterhin `_updatedAt`, dort ist
  „zuletzt angefasst" die richtige Frage.
- **Direkt auf `main` arbeiten**, kein Feature-Branch-Zwang (seit 16.05.).

## Offene Aufgaben

- Kosmetisch: Der Google-Photos-Link steht noch im Slug-Feld der Notiz
  `f21faaae-6c23-422b-953d-5b947c3cde8b`. Kein Handlungsdruck, räumt sich beim
  nächsten Publish selbst auf.
- Nicht direkt gemessen: ein vom Sanity-Webhook (statt Git-Push) ausgelöster Build
  mit dem Fix. Beweist sich beim nächsten Publish von selbst.

## Stolpersteine

- **„Katharina hat veröffentlicht, aber nichts erscheint" ist fast immer ein
  fehlgeschlagener Build, nicht der Webhook.** Diagnose-Reihenfolge steht in
  `CLAUDE.md`. Kurz: Build lokal reproduzieren, Dataset per curl gegen den
  Live-Stand halten. HTTP-`last-modified` taugt **nicht** als Deploy-Alter, das
  ist nur die CDN-Cache-Füllung.
- **Studio-Deploy geht nur aus `astro/sanity/` per `npm run deploy`.** Die CLI
  liegt nicht global. Vorher prüfen, welcher Sanity-Account eingeloggt ist
  (`npx sanity projects list`), es sind mehrere Projekte im Spiel.
- **Schema-Änderungen brauchen einen Studio-Deploy.** Ein Vercel-Deploy des Codes
  reicht dafür nicht.
- **Zwei getrennte npm-Projekte** mit eigenem `node_modules`: `astro/` und
  `astro/sanity/`. Geteilter Code ist nicht möglich, deshalb existiert `slugify`
  doppelt (`astro/src/lib/slug.js` und `astro/sanity/lib/slugify.ts`). Bei
  Änderungen **beide** anfassen, sonst bekommt derselbe Titel im Studio und im
  Frontend zwei verschiedene Adressen.
- **Bilder von Katharina** (Signal-Exporte) kommen als `-rw-------` und untracked
  an. Vor dem Push `chmod` und explizit `git add`.

## Umgang mit Katharina

Knapper Schreibstil, Sprach-Codes wie „trüb", „zu schwer", „passt nicht". Wünsche
nie eins zu eins wörtlich umsetzen, sondern als Web-Designer interpretieren und
auf Konsistenz mit dem Rest der Site prüfen. Bei Fehlern: Ursache beim System
benennen, nicht bei ihr. Meistens stimmt ihre Beobachtung, auch wenn die
Erklärung daneben liegt.
