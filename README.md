# Werkstatt Gemeinschaft

Eine fortlaufende Werkstatt von **Katharina Offenborn** — Ergotherapeutin, Reisende, neugierig in der Welt der gelebten Gemeinschaft. Die Site sammelt, was unterwegs entsteht: Notizen, Stationen, Stimmen, Lesestoff, Werkstätten, Podcast.

> *Wie kann gemeinsames Leben heute aussehen — und was tragen die Strukturen, die wir bauen?*

## Stand

Visueller Prototyp als Single-Page (`index.html`). Statisch, ohne Build-Step.

**Schriften:** Cormorant Garamond (Display) + Inter (Text).
**Palette:** Linen-Cream · Sage · Warm-Aubergine · Clay-Rot · Mauve-Rosé.
**Architektur:** „Viele Perlen, eine rote Schnur" — kuratierte Bausteine, durchzogen von Katharinas Stimme.

## Sektions-Karte

```
1. Hero                Gemeinschaft — wie heute. (mit persönlicher Signatur)
2. Drei Prinzipien     Was die Werkstatt trägt
3. Wer ich bin         Foto, Bio, Leitfrage — Katharina früh im Bild
4. Im Profil           Eine zentrale Station (Tempelhof)
5. Stationen           Reise-Galerie (5 Orte, 4:3 Grid, Filter on/off)
6. Aus den Notizen     Chronik mit roter Schnur und Bead-Markern
7. Stimmen             Pull-Quotes von Bewohnern auf dunklem Aubergine
8. Aus der Bibliothek  Lesestoff — Bücher, Artikel, Filme, Podcasts
9. Werkstatt           Termine, eigene Veranstaltung markiert
10. Ein Podcast        Geplant
11. Mitkommen          Drei Pfade zur Begegnung
12. Footer             Signatur Katharina Offenborn
```

## Lokal entwickeln

```bash
python3 -m http.server 4321
# → http://localhost:4321
```

Oder über das Claude-Preview-Panel — die `.claude/launch.json` startet dasselbe.

## Deploy

Über Vercel als Static-Site. Push auf `main` → automatischer Deploy.

**Live:** https://reise-zueinander.de
*(Finale Domain seit 29.06.2026. `katharina-offenborn.de` und `www.` leiten per 308 dorthin. Vercel-Slug bleibt intern `oasen-finder`, `oasen-finder.vercel.app` läuft weiter mit Canonical auf reise-zueinander.de.)*

## Phase 2 — Sanity-CMS für Katharina

Die Site soll von Katharina selbst gepflegt werden. Sanity-Studio bietet ein WYSIWYG-Backend ohne Code, mit Drag-and-Drop für Bilder.

### Schema-Plan

```ts
// /src/sanity/schemas/

note          // Aus den Notizen — Eintrag in der roten Schnur
  date · tag (Reise|Werkstatt|Lesen|Stimme|Foto|Audio) · title · body · image? · audioUrl?

event         // Werkstatt-Termin
  date · title · location · description · isMine (boolean) · registrationLink?

station       // Eine besuchte Gemeinschaft
  name · region · country · image · description · tags · externalLink? · visitDate · reflection

resource      // Bibliothekseintrag
  type (Buch|Artikel|Webseite|Aufsatz|Film|Podcast|Gespräch)
  title · author · note · link · dateAdded

voice         // Stimme aus den Reisen
  person · role · place · quote · context

podcastEpisode  // Audio-Folge
  number · title · audioUrl · publishedAt · summary · duration · guests
```

### Migration

1. **Astro** als Framework: `index.html` zerlegen in Komponenten (`Hero`, `Who`, `Chronicle`, `Library`, `Termine`, …)
2. **Sanity-Client** holt Inhalte via GROQ-Queries
3. **Astro Content Collections** typsichere Inhalte
4. **Webhook**: jeder Sanity-Publish triggert Astro-Build → Vercel-Deploy

### Was Katharina im Backend tut

- Klickt „Neue Notiz" → Datum, Tag, Titel, Body — fertig
- Lädt Foto hoch → wird automatisch responsiv ausgeliefert
- Verlinkt Audio-URL → erscheint als Player in der Notiz
- Veröffentlicht → Site ist nach 30s aktualisiert

## Inhalte heute ändern (Phase 1)

Alle Texte und Bildreferenzen leben in `index.html`. Auffindbar über die Sektions-Kommentare:

```html
<!-- HERO -->                Headline + Lead + Signatur
<!-- MANIFEST STRIP -->      i./ii./iii.-Prinzipien
<!-- WER ICH BIN -->         Foto + Bio + Leitfrage
<!-- FEATURED PLACE -->      Tempelhof als Vollporträt
<!-- PLACES GRID -->         5 Stationen
<!-- AUS DEN NOTIZEN -->     Chronik-Liste mit Beads
<!-- VOICES -->              3 Pull-Quotes
<!-- AUS DER BIBLIOTHEK -->  6 Lesestoff-Einträge
<!-- TERMINE -->             3 Termine, einer Katharinas
<!-- PODCAST (geplant) -->   Geplanter Podcast
<!-- MITKOMMEN -->           Drei Pfade
```

## Out of Scope im Prototyp

- Keine Detail-Seiten (jede Station / Notiz öffnet aktuell den Anchor)
- Keine Karte der Reisen (Phase-2-Kandidat: Mapbox oder Leaflet)
- Kein Newsletter-Backend (Phase 2)
- Keine Mehrsprachigkeit
- Keine Kommentare

## Lizenz

Code: MIT — Inhalte, Fotos und Texte gehören Katharina Offenborn. Unsplash-Bilder folgen ihrer freien Lizenz.
