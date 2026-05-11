# Werkstatt Gemeinschaft — Planung

*Eine Landkarte für Katharina Offenborn.*
*Stand: 11. Mai 2026 (überarbeitet nach Katharinas Antworten zu Fragebogen v4).*

---

## Das Bild

Stell dir die Website als ein **Haus mit Türen** oder ein **kunstvolles Regal** vor. Du stehst **dahinter** — sortierst, ordnest, stellst Dinge auf den richtigen Platz. Vorn kommen Besucher hin, lesen die Türen-Schilder, klicken die Tür, die sie zieht.

Mit Katharinas Antworten ist eine zweite Ebene dazugekommen: jeder Raum ist auch eine **„BAR"** — ein Ort, an dem man kurz haltmacht, einen Blick teilt, mitnimmt. Doppelter Sinn:

- **„-bar"** als deutsches Suffix → *machbar · denkbar · sichtbar · hörbar*
- **„Bar"** als Treffpunkt → ein Platz, eine Theke, ein Stuhl. Nicht laut, nicht voll. Warm.

Das verändert nichts am Haus-Bild, aber es verändert den **Charakter** der Räume: keine sterilen Regalfächer mehr, sondern lebendige BARs mit eigener Atmosphäre. Aus dem Schaufenster wird ein kleines Quartier mit mehreren Türen.

Damit das funktioniert, brauchen wir:

1. **Eine klare Architektur** — welche -BARs gibt es, in welcher Reihenfolge, welche sind Top-Level, welche Sub
2. **Klare Inhalte je Raum** — Schemas im Backend, einheitliche Eintrags-Struktur
3. **Ein Visual-Konzept** — die -BAR-Stimmung sparsam, nicht überladen

---

## Architektur — Stand nach Katharinas Antworten

### Neun -BAR-Räume

```
HAUS  ·  (Brand-Name offen — siehe unten)

   ┌──────────────────────┐
   │ VereinBAR/WunderBAR  │  ← Eingang · Wer? Was? Aktuelle Termine
   │   (Rückfrage offen)  │     Sofort sichtbar
   └──────────────────────┘

   ┌──────────────────────┐
   │ erkennBAR            │  ← Wer Katharina ist · Bio · Prägung
   └──────────────────────┘

   ┌──────────────────────┐
   │ SchreibBAR           │  ← Texte · Gedichte · Notizen
   │   +DenkBAR (Sub)     │     Sub: Ideen · Visionen · Umfragen
   └──────────────────────┘

   ┌────────────┐ ┌────────────┐ ┌──────────────────┐
   │ BewegBAR   │ │ MachBAR    │ │ LesBAR           │
   │ Karte +    │ │ Werkstatt- │ │ Bibliothek       │
   │ Reisen     │ │ Termine    │ │ +BrauchBAR (Sub) │
   └────────────┘ └────────────┘ └──────────────────┘
                                    Sub: Konzepte · Werkzeuge

   ┌──────────────────────┐
   │ HörBAR               │  ← Reflexionen · Gedichte · Lieder
   └──────────────────────┘

   ┌──────────────────────┐
   │ Mitkommen            │  ← Online-Formular · Einladungs-Kategorien
   └──────────────────────┘
```

**Begründung Sub-Bereiche** *(Vorschlag zur Diskussion)*:

- **DenkBAR als Sub von SchreibBAR** — beide „in geschriebener Form", aber DenkBAR zukunftsorientiert *(Visionen)*, SchreibBAR vergangenheits-/gegenwartsorientiert *(Notizen, Gedichte)*. Innerhalb von SchreibBAR als Filter/Tab.
- **BrauchBAR als Sub von LesBAR** — beide „Material zum Mitnehmen", aber BrauchBAR anwendbar *(Konzepte, Werkzeuge)*, LesBAR rezeptiv *(Lese-/Hör-Material)*. Tab im LesBAR-Raum.

Alternative: alle 9 Räume als Top-Level. UX-mäßig zu viel — 9 Punkte überlasten die Mobile-Navigation. Sub-Modell ist besser, aber **mit Katharina zu klären**.

### Was in jeder -BAR liegt

| -BAR | Hauptinhalt | Was Besucher tun |
|---|---|---|
| **VereinBAR** | Herzensanliegen + nächste Werkstatt-Termine + Jahres-Rhythmus *(Winter Pause · F/H Kreta · Sommer reisend)*. Später: Rückmeldungen/Kurzvideos | Verstehen worum es geht · Mitkommen |
| **erkennBAR** | Bio, Fotos, Prägungs-Liste, Anliegen-Satz, Don't-Liste *(„Coach, Referent, Experte" — nein)* | Person kennen lernen |
| **SchreibBAR** *(+DenkBAR)* | Gedichte, Gedanken, Notizen *(Sub: Ideen, Visionen, Umfragen)*. Cross-Posting zu Substack | Lesen · weiterklicken zu Substack |
| **BewegBAR** | **Interaktive Karte** mit Reiserouten + Foto-Pins der besuchten Gemeinschaftsorte | Karte erkunden · Orte entdecken |
| **MachBAR** | Werkstatt-Termine *(eigen + fremd)*, saisonal sortiert, mit Hundefreundlich-Filter *(Carla)*. Honorar individuell besprechen | Sich anmelden via Online-Formular |
| **LesBAR** *(+BrauchBAR)* | Bücher · Webseiten · Filme · Podcasts · Gespräche mit Notiz. Verlinkung zu `wortgetreu.com`. *(Sub: Konzepte, Werkzeuge)* | Weiterlesen · Werkzeug anwenden |
| **HörBAR** | Eingesprochene Reflexionen, Gedichte, Lieder. YouTube/Spotify/Apple-Music-Embeds | Hören |
| **Mitkommen** | Online-Formular mit 7 Einladungs-Kategorien *(Werkstatt-Teilnahme, Gemeinschafts-Einladung, Vortrag, Beratung, Interview-später, Gespräch, Vernetzungs-Hilfe)* | Kontakt aufnehmen |

### Hierarchie für Besucher

- **5 Sekunden:** VereinBAR — *„Aha, das ist Katharina, sie öffnet Räume für Miteinander-Fragen."*
- **2 Minuten:** SchreibBAR oder HörBAR — *„Was schreibt/spricht sie gerade?"* *(ihre Hauptbereiche)*
- **5 Minuten:** Eine andere -BAR auf *(BewegBAR-Karte, MachBAR-Termin, LesBAR-Notiz)*
- **Längst dabei:** Mitkommen — *„Ich nehme Kontakt auf."*

---

## Backend-Schemas pro -BAR

Alle Textfelder als **i18n-Felder** *(DE/FR/EN)* ab Tag 1. KI-Vor-Übersetzung als Hilfe in Sanity Studio aktivieren.

```
schreibBARNote  (SchreibBAR + DenkBAR via kind-Filter)
  publishedAt     date (Default: heute, automatisch)
  title           i18nString
  kind            select  [notiz · poesie · idee · vision · umfrage]
  body            i18nText (rich)
  tags            array of strings
  hero            image (optional)
  mediaLink       url (optional — z.B. YT/Spotify)
  pdfAttachment   file (optional)
  externalLink    url (optional)
  substackUrl     url (optional, separates Feld — Hub-Logik)

bewegBARStation  (BewegBAR)
  name            string
  region          string
  country         string
  visitedAt       date OR daterange
  coordinates     geopoint              ← für die Karte
  images          array of images
  reflection      i18nText
  tags            array of strings      [Ökodorf · Cohousing · Spirituell · …]
  communityLink   url (optional)
  conceptPdf      file (optional)

machBAREvent     (MachBAR)
  startDate       datetime
  endDate         datetime (optional, falls mehrtägig)
  title           i18nString
  location        string
  locationCoords  geopoint (optional, für spätere Karten-Verschneidung)
  description     i18nText
  registration    object { mode: [mail/link/formular], target: string }
  ownership       select [eigener · fremder]
  season          select [winter · fruehjahr · sommer · herbst]
  dogFriendly     boolean               ← Carla-Filter
  photo           image (optional)
  programPdf      file (optional)
  fees            i18nText (Default: „individuell besprechen")

lesBARResource   (LesBAR + BrauchBAR via kind-Filter)
  kind            select [buch · webseite · aufsatz · film · podcast · gespraech · konzept · werkzeug]
  title           i18nString
  authorOrSource  string
  note            i18nText
  link            url
  coverImage      image (optional)
  pdfAttachment   file (optional)

hoerBAREpisode   (HörBAR)
  episodeNumber   number
  title           i18nString
  platform        select [youtube · spotify · applemusic · sonstige]
  url             url
  publishedAt     date
  summary         i18nText
  cover           image (optional)
  transcriptPdf   file (optional)

erkennBARAbout   (erkennBAR) — Singleton
  shortBio        i18nText
  longBio         i18nText
  portraits       array of images
  influences      array of i18nText     [Prägungs-Liste — Waldorf, Wien, Frankreich, …]
  mantra          i18nString            (Anliegen-Satz)
  notDescribedAs  array of strings      [„Coach", „Referent", „Experte"]

mitkommenForm    (Mitkommen) — Singleton/Konfiguration
  inviteCategories  array of objects [
                      { label: i18nString,
                        kind: select [werkstatt · einladung · vortrag · beratung
                                     · interview · gespraech · vernetzung] }
                    ]
  emailRecipient  string
  intro           i18nText
```

**Eigentum:** Sanity-Studio wird **in Katharinas Namen** angelegt *(siehe strategisches Item 6)*.

---

## Karten-Komponente für BewegBAR

Katharinas Wunsch: *„interaktive Karte als Frontend möglich, hinter der ich Routen und Orte ablegen kann? Ein wenig wie im Wertekreis…"*

| Lösung | Vorteile | Nachteile |
|---|---|---|
| **Leaflet + OSM-Tiles** | Open Source, kostenlos, sehr gut dokumentiert, Standard | Klassischer Karten-Look, begrenzt designbar |
| **MapLibre + MapTiler** | Vector-Tiles, in Brand-Farben designbar, moderner Look | Mehr Setup, externer Tile-Provider *(MapTiler-Free-Tier reicht meist)* |
| **Mapbox** | Sehr schön, viele Features | Vendor-Lock-in, kostenpflichtig ab ~50k Loads/Monat |
| **Statisches SVG mit Pins** | Voll im Brand-Look, kein JS-Maplib | Nicht zoombar, jede Änderung = neues SVG |

**Empfehlung:** **Leaflet** für Phase 1 — pragmatisch, schnell live. Bei Bedarf später auf **MapLibre + MapTiler** wechseln *(Datenmodell bleibt gleich, nur die Render-Schicht ändert sich)*.

**Vorgehen:**
1. `bewegBARStation`-Dokumente in Sanity haben `coordinates: geopoint`
2. Astro-Page lädt alle Stationen, rendert Pins auf Leaflet-Karte
3. Klick auf Pin → Popup mit Bild + Titel + Link zum vollen Eintrag
4. *(zweite Iteration)*: Reise-Routen als Polylines zwischen Stationen einer Tour

---

## Visual-Konzept — die -BAR-Idee stützen

Die -BAR-Doppelbedeutung *(Treffpunkt + machbar-Suffix)* soll visuell **mitschwingen, ohne zu überladen**. Sparsame Bild-Setzung — ein Bild pro Raum maximal, plus zentrales Hero in VereinBAR.

**Bildsprache-Stichworte für Unsplash-Suche** *(in der Reihenfolge der Räume)*:

| -BAR | Suchbegriffe | Stimmung |
|---|---|---|
| **VereinBAR / Hero** | *„communal table candlelight"* · *„long wooden table evening"* · *„rustic gathering golden hour"* | Menschen am langen Tisch, warmes Licht, abendlich. **Aktuelles Hero-Foto passt schon** *(golden-hour communal dinner)* — bleibt zunächst. |
| **erkennBAR** | Katharinas eigenes Porträt *(vorhanden)* | Persönlich, nicht inszeniert |
| **SchreibBAR** | *„handwriting notebook morning light"* · *„open journal pen"* | Ruhig, schreibend, Tagebuch-Charakter |
| **BewegBAR** | *(Karte ist Hauptelement)* + 1 sekundäres Bild: *„walking path landscape"* · *„rural road bicycle"* | Unterwegs, eigenes Tempo |
| **MachBAR** | *„wooden workbench tools daylight"* · *„hands working clay"* | Werkstatt-Charakter, Holz, Hände-bei-der-Arbeit |
| **LesBAR** | *„old books wooden table reading"* · *„open book afternoon light"* | Lesen, Sammeln, Stille |
| **HörBAR** | *„microphone candlelight intimate"* · *„single chair listening"* | Stimme, Innerlichkeit |
| **Mitkommen** | Kein Bild nötig *(Formular-Sektion, schlicht)* | — |

**Was zu vermeiden ist:**
- Stockfoto-spirituell *(Sonnenaufgang mit ausgebreiteten Armen)*
- Generisch-warm *(zu glatt, zu Marketing)*
- **Cocktailbar-Klischee** *(das wäre die falsche „Bar")* — also keine Theken mit Flaschen, keine Bar-Hocker, keine Drinks
- Menschenmassen *(„Werkstatt" ist klein, intim)*

**Konkrete Bild-Auswahl** erfolgt in Track B *(Visual-Sketch im Prototyp)*.

---

## Brand-Name — Optionen

| Option | Stärke | Schwäche |
|---|---|---|
| **Werkstatt Gemeinschaft** *(Arbeitstitel)* | Bekannt, klar | Generisch, ohne -BAR-Bezug |
| **WERK-statt allein unterwegs** *(aus ihrer 3.1a-Antwort)* | Stark, persönlich, eigenes Wortspiel | Lang, mobile-unhandlich, eher Untertitel |
| **„WERK-statt" + Untertitel „allein unterwegs"** | Brand kurz, Claim trägt das Wortspiel | Untertitel muss überall mitlaufen |
| **„MitBAR" / „GemeinschaftsBAR"** *(Neuwortbildung)* | Konsequent im System | Klingt konstruiert, Cocktailbar-Risiko |
| **„Katharina Offenborn — VereinBAR"** | Persönlich, klar | Macht Person zentral statt Anliegen |
| **„Die BARs"** *(Plural als Name)* | Konzeptionell stark, kurz | Gastronomie-Assoziation |

**Vorschlag zur Diskussion:** **„WERK-statt"** als Brand-Name *(eigenständig + Wortspiel)*, **„allein unterwegs"** als Untertitel, die **-BAR-Räume** als Architektur. Damit trägt der Name Katharinas eigene Formulierung, und das -BAR-System lebt darunter ohne ins Markennamens-Spektrum zu drängen.

Aber: ihre Entscheidung. Diese Tabelle als Mail-Anhang oder bei einem Telefonat besprechen.

---

## Offene Klärungen mit Katharina

*Sortiert nach Priorität:*

| # | Frage | Wo geklärt |
|---|---|---|
| 1 | **VereinBAR oder WunderBAR?** | Rückfragen-Mail draußen |
| 2 | **Drei Worte für ihren Ton?** | Rückfragen-Mail draußen *(Frage 1.2c umformuliert)* |
| 3 | **Sub-Bereiche oder alle Top-Level?** *(DenkBAR/BrauchBAR)* | Per Mail nach den ersten zwei Antworten |
| 4 | **Brand-Name?** | Telefonat oder Treffen — zu viel für Mail |
| 5 | **wortgetreu.com:** bleibt eigenständig oder einmal-importieren? | Per Mail, sobald Phase 1 beginnt |
| 6 | **`anthroposophie-lebensnah`** — aktiv? Verlinken oder einstellen? | Per Mail |
| 7 | **„Wir" statt „ich"** — wer ist „wir"? | Beobachten beim Texten, ggf. Rückfrage |

**Was ohne Klärung beginnen kann:** Architektur-Gerüst, Schemas in Sanity, erkennBAR-Sektion *(unabhängig)*, Karten-Komponente technisch. Brand-Name und Namensgebung der Eingangs-BAR sind später anwendbar — Klassen-Namen im Code abstrakt halten *(`HeroBAR` als Code-Name, Display-Text aus Sanity)*.

---

## Vorgeschlagene Phasen

Jede Fragebogen-Etappe schaltet eine Build-Etappe frei. Katharina antwortet, wir bauen, sie sieht, sie antwortet mehr. Kein „alles auf einmal".

### 🏠 Etappe 1 · Das Gerüst — *1–2 Wochen*

**Voraussetzung:** Katharinas Antworten zu Fragebogen Etappe 1 *(8 Themen, ~15 Min — siehe `FRAGEBOGEN-KATHARINA.md`)*

**Fokus:** Struktur, Navigation, Ton — keine Look-, Domain- oder Deploy-Fragen.

**Was wir bauen:**
- Migration von der statischen Prototyp-Seite zu **Astro + Sanity-CMS**
- Sanity-Schemas für alle Hauptbereiche, **dreisprachig vorbereitet ab Tag 1**
- Plattform-Einbettungen vorbereitet (YouTube, Substack, Instagram — falls vorhanden)
- Katharina bekommt einen **Studio-Login** und kann Inhalte selbst eintragen
- Test-URL geht live

**Was sie sieht am Ende:** Die leere Struktur, alle Bereiche, navigierbar.

### 🛋️ Etappe 2 · Bereiche möblieren — *2–4 Wochen*

**Fragen, die wir dann stellen** *(grob skizziert)*:
- **Über dich**
  - Drei konkrete Dinge, die du Besuchern anbietest
  - Welche Erfahrungen haben dich glaubwürdig gemacht? Was hat dich geprägt?
  - Ein Satz, der dich beschreibt
  - Wie willst du nicht beschrieben werden?
- **Einladungen**
  - Welche Anfragen nimmst du an? *(Werkstatt-Teilnahme · Einladung zu euch · Vortrag · Beratung · Interview · Gespräch)*
  - Kontakt-Wege (Mail · Formular · Telefon)
  - Rahmenbedingungen sichtbar oder individuell
- **Notizen-Strom**
  - Posting-Frequenz, Tag-Kategorien
- **Werkstatt-Termine**
  - Eigene Termine, fremde Termine zeigen, Anmeldung
- **Bilder & Foto**
  - **Anti-Liste**: welche Bildsprache soll *nicht* entstehen *(generisch-spirituell, Stockfoto-warm, …)*
  - Stil-Richtung: *dokumentarisch · poetisch · reduziert · nah · rau · hell · naturbezogen*
  - Foto von dir: Porträt · Hände bei Arbeit · keins
- **Untertitel / Claim** unter dem Namen *(optional)*
- **Brand-Name-Check** — bleibt „Werkstatt Gemeinschaft" oder anders?

**Was sie sieht am Ende:** Das bewohnte Haus mit ihrer Stimme darin.

### 🌱 Etappe 3 · Wachsen + Launchen — *nach Bedarf*

**Fragen, die wir dann stellen** *(grob skizziert)*:
- **Bibliothek-Inhalte** — welche Quellen-Arten
- **Podcast / YouTube** — geplant ja/nein, Plattform, Embed-Modus
- **Sprachen aktivieren** — welche Inhalte zuerst FR/EN, wer übersetzt
- **Technische Realität**
  - Wer pflegt die Site später? *(Katharina selbst, jemand mit?)*
  - Newsletter geplant?
  - Kalender-Anbindung?
  - DSGVO · Impressum · Datenschutz vorhanden?
- **Domain & Hosting** — endgültige URL, vorhanden oder neu zu registrieren
- **Look-Feintuning** *(optional, da Look schon gefällt)*
  - Farb-Shift gewünscht?
  - Andere Schrift?
- **Launch-Termine** — Soft (Familie) und Public

**Was sie sieht am Ende:** Das wachsende, lebendige Haus, mit der Welt eingeladen.

---

### Sieben strategische Themen — nicht vergessen

Diese sind im Laufe der Gespräche identifiziert worden und müssen in den Phasen abgedeckt sein. Stand jetzt sind sie alle nicht im Fragebogen *(weil v4 zur Strukturklärung dient)*, aber sie liegen hier als verbindliche Roadmap-Items.

| # | Thema | Wann zu klären |
|---|---|---|
| 1 | **Geschäftsmodell** — Werkstatt-Preise, Beratung, Buchungslogik, Anzahlung/Stornierung. Beeinflusst Backend-Felder für `event`-Schema *(Preis-Feld, Anmelde-Modus)* | Mit Katharina direkt klären, sobald Antworten zu Abschnitt 3.5 da sind |
| 2 | **Newsletter** — ihr einziges plattform-unabhängiges Asset. Tool entscheiden *(Buttondown · Substack · MailerLite · …)*, Doppel-Opt-In, in `mitkommen`-Section einbauen | Phase 2 oder 3, vor Public-Launch |
| 3 | **DSGVO/Impressum/Datenschutz** — Pflicht bei deutscher Domain. Generator-Lösung *(eRecht24)* für Start akzeptabel. Cookie-Hinweis falls Analytics genutzt | Vor Soft-Launch |
| 4 | **Hub-Logik beidseitig** — alle ihre Plattformen *(YouTube, Instagram, Substack, …)* müssen in ihren Bio-Links auf die Website zurückverlinken. Sonst bleibt die „zentrale Anlaufstelle" eine Insel. | Beim Launch — Checkliste für Katharina |
| 5 | **Mindest-Content vor Soft-Launch** — Faustregel: 3-5 Notizen, 2-3 Stationen, 1-2 Bibliothek-Einträge. Sonst wirkt die Site „unfertig". | Bedingung für Soft-Launch |
| 6 | **Eigentum und Zugang** — Domain, Vercel-Account, Sanity-Account, ggf. GitHub-Repo in **Katharinas Namen**. Backup-Strategie falls Auftraggeber wegfällt. | Phase 1 — bei Account-Setup gleich richtig anlegen |
| 7 | **Mobile-Editing** — Sanity-Studio auf Tablet/Phone testen. Falls schwierig: Fallback-Workflow *(z.B. Mail-Eingang, der automatisch zu Drafts wird)* | Phase 1 — beim Sanity-Setup testen |

---

### Warum diese Stufung sinnvoll ist

| Für Katharina | Für den Build |
|---|---|
| Kein Overwhelm — sie liest 10 Min, beantwortet 10 Min, fertig für jetzt | Wir bauen mit echten Antworten, nicht mit Vermutungen |
| Sie sieht nach Etappe 1 schon ihr Gerüst — Vertrauen wächst | Etappe 2 kann auf dem Echtbild aufsetzen, kein Re-Work |
| Konkrete Fragen werden mit konkretem Bild leichter beantwortet | Spätere Etappen entstehen organisch aus der Nutzung |
| Sie kann jederzeit abbrechen oder pausieren ohne Bauruine | Wir launchen sauber, wenn das Haus wirklich bewohnbar ist |

---

## Technische Architektur — kurz

*Für später, zur Information. Du musst das nicht verstehen, um zu pflegen.*

- **Frontend:** Astro *(statisch generiert, schnell, SEO-freundlich)*
- **Inhalts-Backend:** **Sanity Studio** *(WYSIWYG, Drag-and-Drop für Bilder)*
- **Hosting:** Vercel
- **Mehrsprachigkeit:** locale-aware Schemas in Sanity *(jedes Textfeld bekommt drei Sprachfassungen)*; Astro routet `/de/...`, `/fr/...`, `/en/...`
- **Was du im Studio siehst:** für jeden Raum ein Formular *(„Neue Notiz", „Neue Werkstatt"…)* mit Eingabefeldern, Bild-Upload, Tag-Auswahl, Veröffentlichen-Knopf

---

## Was wir von dir brauchen, um zu starten

Wenn du **diese fünf Antworten** schreibst, können wir Phase 1 beginnen:

1. **Räume bestätigt** — und ihre Reihenfolge
2. **Hauptraum** — wo du am meisten lebst
3. **Drei Worte für deinen Ton**
4. **Was du an Inhalten schon hast** *(grobe Liste reicht)*
5. **Wunschtermin** für „Familie und Bekannte dürfen reinschauen"

Der Rest klärt sich Stück für Stück. Dieses Dokument ist kein Examen. Es ist eine **Karte, an der wir gemeinsam zeichnen**.

— Letzte Aktualisierung: 11. Mai 2026
