# Studio-Upgrade 3.99.0 → 6.20.0 (28.10.2026, erledigt)

Protokoll des Sprungs über drei Hauptversionen. Steht hier, weil der nächste
Sprung (v7) dieselben Stellen betrifft und die Begründungen sonst verloren gehen.

**Betroffen ist nur `astro/sanity/`** — das Studio ist ein eigenes npm-Projekt.
Die Website (`astro/`) hat damit nichts zu tun, sie liest nur das Dataset.

## Was gemacht wurde

Drei Etappen, jede einzeln gebaut, statt ein Sprung über alles. Bei einem
Fehlschlag wäre sonst nicht zu sehen, welche Hauptversion ihn ausgelöst hat.

| Etappe | Version | Dazu nötig |
|---|---|---|
| 1 | `sanity` + `@sanity/vision` 4.22.1 | nichts (Node-Anforderung war erfüllt) |
| 2 | 5.31.2 | **React 18 → 19.3.1** (`react`, `react-dom`, `react-is`, `@types/react`) |
| 3 | 6.20.0 | `@sanity/icons` 5, Icon-Importe, zwei Code-Fixes, tsconfig |

## Die vier Stellen, die wirklich brachen

1. **`@sanity/icons` v5 hat die Sammel-Importe abgeschafft.** `ComposeIcon` &
   Co. kommen jetzt aus eigenen Pfaden (`@sanity/icons/Compose`). Betraf neun
   Dateien: acht Schemas und `sanity.config.ts`.
   **Falle:** Im Root-Export stehen die Namen noch — als `never`-Stub ohne
   Laufzeit-Wert. Ein „ist exportiert?"-Check sagt also ja, und das Icon
   erscheint trotzdem nicht. Nur der Typ verrät es.
2. **`useToast` kommt aus `@sanity/ui/toast`**, nicht mehr aus dem Root
   (dieselbe `never`-Masche). `AutoSlugPublishAction.tsx`.
3. **`publish.disabled` ist kein Boolean mehr**, sondern ein Grund-String
   (`'NO_CHANGES'`, `'ALREADY_PUBLISHED'`, …) oder `false`. Die Action-API will
   weiter ein Boolean → `Boolean(publish.disabled)`. Der Grund wird bewusst
   verworfen; ihn anzuzeigen wäre eine eigene Entscheidung.
4. **`moduleResolution: "node"` → `"bundler"`** in `tsconfig.json`. Die alte
   Auflösung kennt keine `exports`-Maps und findet die Icon-Subpfad-Typen nicht.

Dazu: `@sanity/ui` steht jetzt als echte Abhängigkeit in `package.json`
(`^4.4.9`, dieselbe Range, die `sanity` selbst zieht). Vorher wurde es direkt
importiert, war aber nirgends deklariert — das funktionierte nur, solange npm
es zufällig nach oben hob.

## Automatische Updates sind jetzt an

`sanity.cli.ts` → `deployment.autoUpdates: true` (plus `appId` für die Kanalwahl).
Das deployte Studio lädt seine Sanity-Kernmodule zur Laufzeit statt aus dem Build.

- **Kommt von selbst:** Patch- und Minor-Versionen, dazu Major-Versionen ohne
  Verhaltensänderung (z. B. nur eine neue Node-Anforderung).
- **Kommt NICHT von selbst:** Major-Versionen, die Verhalten ändern — genau der
  Fall von heute. Und der eigene Code hier bleibt in jedem Fall Handarbeit.
- Kanal steht auf `latest`, umstellbar in sanity.io/manage → Studios
  (`stable` wäre die ruhigere Wahl, etwa eine Woche Abstand).
- Nebeneffekt: Der Deploy ist von 6,5 MB auf 0,77 MB geschrumpft.

## Geprüft, nicht nur gebaut

- `npx tsc --noEmit` fehlerfrei, `sanity build` grün.
- Lokaler Dev-Server startet, keine Konsolenfehler.
- Live-Studio nach dem Deploy im Browser geöffnet: Struktur mit allen BAR-Räumen
  da, Icons da, Eintrag geöffnet, Art-Liste zeigt „Artikel". Keine Konsolenfehler.
- Website-Tests (`astro/`, 36 Stück) laufen weiter durch.

## Für die anderen Studio-Projekte

Gilt pro Projekt getrennt; jedes hat seine eigene Version (`npx sanity versions`).
Ein Studio auf einer alten Version ist nicht kaputt, es bekommt nur nichts Neues.
Sinnvoll ist der Sprung dann, wenn an dem Projekt sowieso gearbeitet wird —
und dort gleich `autoUpdates` einzuschalten, damit es nicht wieder drei
Hauptversionen zurückfällt.
