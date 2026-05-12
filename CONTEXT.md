# Werkstatt Gemeinschaft — Projekt-Kontext

*Stand: 11. Mai 2026. Wiedereinstiegspunkt für jede neue Session — wenn du als Claude (oder als Mensch) frisch in dieses Projekt einsteigst, lies dies zuerst.*

---

## In einem Satz

Persönliche Website für **Katharina Offenborn** *(Ergotherapeutin, Ende 60, mehrsprachig)* — eine zentrale Anlaufstelle für ihre Reisen zu Gemeinschaftsorten im DACH-Raum, ihre Werkstätten, Notizen, Lesefrüchte und ggf. einen Podcast. **Brand:** „**WERK**statt Gemeinschaft" mit Claim „Miteinander vereinBAR — Gemeinschafts**WERK** statt allein unterwegs".

---

## Wo wir gerade stehen *(Stand 12. Mai 2026)*

- ✅ Visueller Prototyp live unter **[oasen-finder.vercel.app](https://oasen-finder.vercel.app)** — sehr weit poliert, Multi-Page-Migration steht noch aus
- ✅ Fragebogen v4 beantwortet, Katharinas Stimme in den Inhalten
- ✅ **-BAR-Architektur entschieden:** 9 Räume *(VereinBAR · erkennBAR · SchreibBAR · BewegBAR · MachBAR · LesBAR · HörBAR · DenkBAR · BrauchBAR)* + Mitkommen
- ✅ **Brand entschieden:** WERKstatt Gemeinschaft + Claim; „WERK"-Silbe in Honig-Gold als Brand-Akzent durchgezogen
- ✅ **VereinBAR** als Hero-Bereich-Name gewählt *(WunderBAR fiel raus weil belegt)*
- ✅ **URL-Architektur entschieden:** deutsche Pfade *(`/bewegbar/`, `/machbar/` usw.)*, Deutsch ohne Sprach-Präfix, FR/EN als Sub *(siehe PLANUNG.md)*
- ⏳ **5 offene Klärungen** mit Katharina *(siehe „Offene Klärungen" in PLANUNG.md)*: 3 Worte für ihren Ton · Sub-Bereiche · wortgetreu.com · anthroposophie-lebensnah · „Wir"
- ⏳ **Phase 1 (Astro + Sanity-Gerüst)** ist der nächste große Schritt — die offenen Klärungen blockieren das nicht

---

## Wer macht was

- **Katharina Offenborn** — Auftraggeberin & spätere Inhaltspflegerin. Ergotherapeutin, vielfältig interessiert, vertraut mit Steiner-Dreigliederung, neigt zu Fragmenten in der Kommunikation. Nicht tech-native. Spricht Deutsch/Französisch/Englisch.
- **Carla** — Katharinas Hund. Muss bei Werkstatt-Terminen mitkommen können — relevant für die MachBAR-Logik *(hundefreundlicher Veranstaltungsort als Filter/Hinweis)* und für die Standortwahl bei Einladungen.
- **Auftraggeber/User** *(in diesem Repo der GitHub-Account `restitutio777`)* — orchestriert das Projekt, kennt Katharina persönlich. **Du-Form zwischen ihm und Katharina** (also nicht „uns" sondern „mir/dir" im Fragebogen).
- **Claude (ich)** — baut, schreibt, iteriert. Wird per Session über diesen Kontext informiert.

---

## Kommunikations-Konventionen (kritisch)

Wenn du als neuer Claude in dies einsteigst, hier die wichtigsten Stilregeln aus iterativem User-Feedback:

| Tu | Nicht |
|---|---|
| Direkt, knapp, klar | Langes „einfühlsames Gelaber" |
| Bildliche Sprache *(Schaufenster, Regal, Kästen)* | Technisches Vokabular wie „Schema", „MVP", „Iteration" |
| „Backend" *(im Fragebogen)* | „Sanity" *(im Fragebogen — intern ok)* |
| Konkrete Vorschläge mit Beispielen | Abstrakte Marketing-Fragen *(„Hauptpublikum?")* |
| Du-Form Auftraggeber↔Katharina | „uns einmalig zurückschicken" |
| Schlichte deutsche Worte | Anglizismen / Berater-Jargon |
| Eine Sektion = ein Thema | „1000 Phasen" Mikro-Etappen |
| Frage was wirklich gebraucht wird | Frage was sie im Backend selbst entscheiden kann *(Frequenz, etc.)* |

**Wichtig:** der User kürzt und korrigiert iterativ. Wenn er sagt „schlechter copy" oder „künstlicher rückschritt" — nicht beleidigt sein, neu denken.

---

## Commit-Message-Konvention

**Deutsch, knapp, mit thematischem Präfix.** Versionierung bei iterierten Dokumenten.

Beispiele aus diesem Repo:
```
Fragebogen v4: Schaufenster/Regal-Bild durchziehen, Domain als P.S.
Hero: visual-led, less text, softer dark
Planung: sieben strategische Themen ergänzt
Kontext: vier Verbesserungen aus Session-Review
```

**Nicht** das englische conventional-commits-Format `feat: add user signup` o.ä. — der Repo-Stil ist deutsch und thematisch.

---

## Commit-Workflow *(Best Practice 2026)*

**Atomare Commits bei Meilensteinen, Sauberkeit immer.**

**Automatisch committen** *(ohne Rückfrage)*, wenn:
- Eine klar abgegrenzte logische Einheit fertig ist *(z.B. „Architektur-Dokument überarbeitet", „neue Quelldatei integriert", „Phase X abgeschlossen")*
- Ein Feature funktioniert und ist verifiziert *(Karte rendert, Schema steht, Form funktioniert)*
- Ein Bug ist gefixt und der Fix ist getestet

**Aktiv nachfragen vor Commit**, wenn:
- Edits über mehrere Themen verteilt sind und nicht klar ist, wie atomar zu zerlegen
- Halbfertige Arbeit vorliegt *(WIP — entweder mit `WIP:`-Präfix committen oder warten)*
- Edits außerhalb des Repos nötig wären *(Sanity-Doc, Vercel-Config, externe Services)*
- Größere Strukturänderungen ohne explizite Anweisung *(Dateien verschieben, Tech-Stack wechseln, Dependencies upgraden)*

**Hygiene-Regeln:**
- `git status` vor jedem Commit lesen — **nie blind** `git add -A` *(verhindert versehentliche `.env`- oder Secret-Commits)*
- Pre-Commit-Hooks **nie** mit `--no-verify` umgehen — wenn ein Hook scheitert: Ursache fixen, dann **neuer** Commit
- **Atomare Commits**: ein Commit = ein logischer Schritt, für sich allein konsistent und rückgängig machbar ohne Folgeschäden
- Commit-Message folgt der Konvention oben *(Deutsch, knapp, mit Präfix)*; Co-Author-Footer bei Claude-Commits
- **Bei Hook-Failure: neuer Commit, nicht `--amend`** *(verhindert Verlust vorheriger Arbeit, wenn der vorherige Commit nicht zustande kam)*
- **Nie** `git push --force` auf `main` — wenn nötig, in Rücksprache mit Auftraggeber
- Push erst, wenn Auftraggeber explizit zustimmt oder ein klares Vorgehen vereinbart ist *(in diesem Repo: Vercel auto-deployt → jeder Push auf `main` geht live)*

---

## Architektur-Entscheidungen (gesetzt)

### Sektionen der Landing *(in dieser Reihenfolge)*
1. **Hero** — Headline „Auf der Suche — wie wird *Gemeinschaft*?" mit goldener-Stunde-Dinner-Foto + abstrakter Vertikal-Gradient *(cream→peach→mauve→aubergine, „grounding at bottom")*
2. **Wer ich bin** — Foto, kurze Bio, Leitfrage
3. **Aus den Notizen** *(Hauptbereich)* — die „rote Schnur" mit roten Bead-Markern, datierte Einträge (Reise · Werkstatt · Lesen · Stimme · Foto)
4. **Drei Türen** — Pfeiler-Karten zu *Reisen · Werkstatt · Bibliothek*
5. **Podcast-Bar** — schlanker Streifen
6. **Mitkommen** — drei Wege auf Sage-Hintergrund

### Design-System
- **Schrift:** Cormorant Garamond *(Display, italic)* + Inter *(Body)*
- **Palette:** Linen `#f6f4ee` · Warm-Aubergine `#2c2530` *(statt Schwarz)* · Clay-Rot `#a8392b` · Fern-Grün `#3d6b54` · Mauve-Rosé `#a87a72` · Sage `#d4dfd0` · Warm-Peach `#e8b987`
- **Hero-Header** in einer einzigen italic Cormorant-Geste, **kein „Hartes Schwarz"** — alle Primary-Texte in warm aubergine
- Brand-Schrift: „**Werkstatt** *Gemeinschaft*" — bold + italic-rot
- Mobile: Hamburger-Menü mit Fullscreen-Overlay

### Tonale Richtung
- Lebensfrohe, naturnahe Farben
- Editorial, ruhig, nicht corporate
- Italic-Akzente sparsam *(genau 1 pro Headline)*

---

## Tech-Stack

### Jetzt *(Prototyp)*
- **Statische HTML** in `index.html` *(eine Datei, ~2000 Zeilen)*
- Inline CSS
- Hosting: **Vercel** (`oasen-finder.vercel.app`)
- Repo: **GitHub** `restitutio777/oasen-finder`
- **Hero-Foto:** Unsplash-Platzhalter *(`photo-1761092315416-ed229b18e3d6` — communal table mit Blumen, blurred 28px als atmosphärische Stimmung)*. Stützt die -BAR-Idee *(Treffpunkt + Werkstatt-Charakter)*. Vorher: `photo-1738034950582-271276c5af7d` *(golden-hour communal dinner)*. Vor Public-Launch durch eigenes Material von Katharina ersetzen — Unsplash-Lizenz ist auch kommerziell ok, aber als zentrales Brand-Bild ist Eigen-Material besser.

### Geplant *(ab Phase 1, sobald Antworten da)*
- **Astro** *(Static-Generator)*
- **Sanity CMS** *(WYSIWYG-Backend für Katharina)*
- **Vercel** *(unverändert, mit GitHub-Auto-Deploy)*
- **i18n: DE / FR / EN** *(von Tag 1 vorbereitet, Sprachblöcke pro Eintrag)*
- Optional: KI-Vor-Übersetzung *(als Hilfe für Katharina)*

### Backend-Schemas *(pro Bereich, vorgeschlagen)*

```
note         — Datum · Titel · Tag · Haupttext · Bild?/Audio?/PDF?/Link?
station      — Name · Region · Datum · Bild · Reflexion · Tags · Link?
event        — Datum · Titel · Ort · Beschreibung · Anmeldung · eigen/fremd
resource     — Typ · Titel · Autor · Notiz · Link · Cover?
podcastEpisode  — Nr · Titel · YT-URL · publishedAt · Summary
```

Diese werden **erst angelegt, sobald Katharina Abschnitt 2 des Fragebogens beantwortet** — sie kann Felder ergänzen/streichen.

---

## Dateien im Repo

```
oasen-finder/
├── index.html                    Aktueller statischer Prototyp
├── favicon.svg
├── vercel.json
├── README.md                     Tech-Übersicht
├── PLANUNG.md                    Interne Roadmap (lies dies für Build-Plan)
├── CONTEXT.md                    Dies hier — Wiedereinstiegspunkt
├── FRAGEBOGEN-KATHARINA.md       Quelle des Fragebogens (an Katharina geschickt)
├── FRAGEBOGEN-KATHARINA.docx     Word-Version (Katharina hat diese)
├── KATHARINA-ANTWORTEN.md        Ihre Antworten + offene Punkte für später
└── .claude/launch.json           Lokaler Preview-Server
```

Lokale Hilfsdateien *(gitignored)*:
- `reference.docx` — Word-Vorlage mit 12pt Calibri / Cambria-Headings
- `.make-reference.py` — Script zum Erzeugen der reference.docx

---

## Strategische Punkte — nicht vergessen

**Bekannte Plattformen von Katharina** *(Stand: Antworten zu 3.3c eingegangen)*:

- **`wortgetreu.com`** — Gedicht-Sammlung, **TYPO3-basiert**. Soll von **LesBAR** *(und ggf. SchreibBAR)* aus angesteuert werden. Pragmatischer Start: nur verlinken. Optional später: einmaliger Markdown-Scrape *(z.B. via Firecrawl)* + Import in Sanity. TYPO3-Headless-API aufzusetzen lohnt nicht für eine kleine Gedicht-Sammlung.
- **`anthroposophie-lebensnah`** — eigene Site ab 2010, älter. Verlinkungs-Status offen *(zu klären: ist die aktiv, oder soll sie auch eingestellt werden?)*.
- **Substack** — geplant, parallel zu SchreibBAR *(noch nicht aktiv)*. Cross-Posting-Logik beim Aufbau berücksichtigen.
- **YouTube / Spotify / Apple Music** — für **HörBAR**-Embeds *(eigene Lieder + eingesprochene Reflexionen)*, noch nicht aktiv. Plattform-Wahl bei Bedarf entscheiden.
- **Inaktive Sites** *(letztens deaktiviert)*: `kinderkrippe-frohsinn`, `lern-und-spielwerkstatt-sonnenschein` — nicht zu verlinken.
- **Bewusst keine Social-Media-Präsenz** — *„habe mich bisher bedeckt gehalten, starte erst jetzt öffentlich durch"*.

Hub-Logik *(Punkt 4 unten)* damit pragmatisch: für die aktiven Bestands-Sites Backlinks auf die neue Site einrichten, Substack & Co. beim Start gleich verlinken.

Diese sieben Themen sind identifiziert und werden in den kommenden Phasen angegangen:

1. **Geschäftsmodell** — Werkstatt-Preise? Beratung als Stunden- oder Pauschalangebot? Anzahlung/Stornierung? *(Frage in Etappe 2 oder direkt mit Katharina klären)*
2. **Newsletter** — ihr einziges plattform-unabhängiges Asset. Tool entscheiden *(Buttondown · Substack · MailerLite · …)* und einbauen.
3. **DSGVO/Impressum/Datenschutz** — vor Launch zwingend. Generator-Lösung *(eRecht24, Datenschutz-Generator)* für den Start akzeptabel.
4. **Hub-Logik beidseitig** — sicherstellen, dass alle ihre Plattformen *(YouTube, Instagram, etc.)* in ihren Bio-Links auf die Website zurückverlinken. Sonst bleibt die „zentrale Anlaufstelle" eine Insel.
5. **Mindest-Content vor Soft-Launch + A11y-Check.** Mindest-Content: 3-5 Notizen, 2-3 Stationen, 1-2 Bibliothek-Einträge. Plus Quick-Lighthouse-Audit + Test mit Katharina selbst am Tablet *(Kontrast Aubergine-auf-Linen, Italic-Cormorant-Lesbarkeit in 14-16 px, Hamburger-Touch-Größe ≥ 44 px)*. Zielgruppe ist u.a. Ende-60 — Lesbarkeit nicht annehmen, prüfen.
6. **Eigentum und Zugang** — Domain, Vercel-Account, Sanity-Account, GitHub-Repo *(falls möglich)* in **Katharinas Namen**. Bus-Faktor operationalisieren:
   - **Logins griffbereit:** Zugangsdaten *(Mail + Passwort, 2FA-Backup-Codes)* zu Vercel, Sanity, Domain-Registrar, GitHub bei Katharina als Papierkopie + verschlüsselt im Mail-Archiv
   - **Backup-Mail-Adresse für 2FA-Recovery** *(z.B. die eines Familienmitglieds, das im Notfall einspringen würde)*
   - **Mini-Anleitung „Eine Notiz einpflegen"** — PDF im Repo + bei Katharina zu Hause ausgedruckt, ~5 Schritte mit Screenshots
   - **Notfall-Kontakt:** wer ist der zweite Mensch, falls Auftraggeber nicht erreichbar ist? *(in CONTEXT.md festhalten, sobald geklärt)*
7. **Mobile-Editing** — Sanity-Studio auf Tablet/Phone testen. Ggf. Fallback: sie schickt Mail an Auftraggeber, der trägt es ein.

---

## Was tun, wenn Antworten von Katharina ankommen

1. Antworten im Repo speichern als `KATHARINA-ANTWORTEN.md` *(oder per Abschnitt: A1, A2, A3)*
2. Pro Abschnitt durcharbeiten:
   - **Abschnitt 1 (Struktur)** → Nav-Reihenfolge final, Anrede final → Update Prototyp + Plan
   - **Abschnitt 2 (Backend-Felder)** → Sanity-Schemas finalisieren → Studio-Setup
   - **Abschnitt 3 (Bio + Material + Sprachen)** → Über-Bereich texten + Material importieren + Sprach-Setup
3. Astro+Sanity-Gerüst aufsetzen *(siehe PLANUNG.md Phase 1)*
4. Sanity-Studio-Zugang für Katharina einrichten
5. Erste Test-Inhalte einpflegen → ihr zur Probe zeigen
6. Iteration bis sie sich darin wohlfühlt → Mindest-Content fürs Soft-Launch füllen lassen

---

## Was tun, wenn Antworten ausbleiben — Stille-Protokoll

Katharina ist Ende 60, reist viel, ist vielfältig eingespannt. Eine Pause ist normal — aber das Projekt sollte nicht latent einfrieren.

**Faustregel-Eskalation:**

| Tag | Aktion |
|---|---|
| **7** | **Freundlicher Mail-Check-in.** Inhalt: „Wollte nur kurz hören, ob du den Fragebogen offen vor dir hast — oder ob etwas unklar ist." Kein Druck. |
| **14** | **Telefon-Anruf** *(falls vereinbart)*. Persönlicher Medien-Wechsel ist oft hilfreich — schriftlich kommt manchmal nicht durch. |
| **21** | **Persönliches Treffen, Video-Call oder Kaffee-Termin** ansetzen. An diesem Punkt ist klar: schriftlich allein reicht nicht — gemeinsam durchgehen. |

**Wichtig:**
- Nie ungeduldig wirken. Sie hat ein Leben, das nicht nur dieses Projekt ist.
- Nicht über das Projekt eskalieren — über *Begleitung* anbieten.
- Nach 21 Tagen Stille trotz Treffen-Versuch: Pause akzeptieren. Auftraggeber entscheidet, ob das Projekt pausiert oder mit Annahmen weiterläuft.

**Für neue Claude-Sessions:** Nicht alleine Nudge-Mails schicken — das ist Auftraggeber-Aufgabe. Du dokumentierst nur den Stand und wartest. Wenn das Datum dieser Datei älter als 14 Tage ist und nichts ankam, vermerk in deiner Antwort: *„Stand ist 14+ Tage alt, lohnt sich ein Stups?"*

---

## Was tun bei neuer Session — Checkliste

Wenn du als frischer Claude oder Mensch hier reinkommst:

- [ ] Lies `CONTEXT.md` *(dies)* — zum Verstehen wo wir stehen
- [ ] Lies `PLANUNG.md` — für Build-Phasen und Architektur
- [ ] Schau auf [oasen-finder.vercel.app](https://oasen-finder.vercel.app) — der visuelle Stand
- [ ] Check ob es `KATHARINA-ANTWORTEN.md` *(oder ähnlich)* gibt — dann sind Antworten da
- [ ] Falls nicht: wir warten noch. Wenn das Datum oben älter als 14 Tage ist, im Reply einen Hinweis aufs Stille-Protokoll geben — selbst keine Mails schicken.
- [ ] Wenn Auftraggeber neue Anforderungen hat: erst klären, dann handeln.
- [ ] Stilregeln aus „Kommunikations-Konventionen" und „Commit-Message-Konvention" oben einhalten

---

## Historie & Evolution

Damit du nicht überrascht bist von Sachen, die schon erwogen und verworfen sind:

- **Ursprungs-Konzept:** „Orte des Wandels" → „Oasen Finder" *(beide verworfen)*
- **Aktueller Brand:** „Werkstatt Gemeinschaft" *(Platzhalter, kann sich noch ändern)*
- **Vercel-Slug:** `oasen-finder.vercel.app` *(historisch, kann bei Launch auf finale Domain umgezogen werden)*
- **Hero-Foto wechselte mehrfach:** bonfire → community-dinner *(aktuell, golden hour)*
- **„Wie heute" → „gelebt" → „gelebt." → „wie wird Gemeinschaft?"** — viele Headline-Iterationen
- **Schwarz `#1a1f1c` → Aubergine `#2c2530`** als primary-text *(User: „kein hartes Schwarz")*
- **Italic Clay-Rot „Gemeinschaft" → Italic Fern-Grün** *(User: „lebensfroh, natürlich")*
- **Fragebogen v1-v4** — mehrere Iterationen, am Ende: 3 Abschnitte, ~15-20 Min, Schaufenster-Metapher, Du-Form

---

## Wichtigste „Don'ts"

1. **Keine 1000 Phasen** erfinden — eine klare Struktur reicht.
2. **Keine abstrakten Marketing-Fragen** *(„Hauptpublikum?", „Was ist das in einem Satz?")* — konkret und im Kontext.
3. **Kein „Gelaber"** — User zerschneidet warmes Beruhigen rigoros.
4. **Kein „uns/wir"** im Auftraggeber-Katharina-Kontext — sie kennen sich, du-Form.
5. **Kein „Sanity"** im Fragebogen oder in Texten an Katharina — „Backend" oder „Hintergrund".
6. **Keine Posting-Frequenz-Fragen** — das entscheidet sie im Backend selbst, nicht relevant zur Strukturklärung.
7. **Keine Domain-Fragen jetzt** — gehört zur Deploy-Phase, ist als P.S. im Fragebogen vermerkt.
8. **Nicht reflexartig vereinfachen oder „verbessern", was schon iteriert wurde.** Headlines, Farben, Wortwahl in `index.html` sind das Ergebnis vieler Runden Feedback *(z.B. Hero ging durch ~6 Versionen, Akzentfarbe Aubergine statt Schwarz, Italic-Wechsel rot→grün, etc.)*. Bei Änderungswunsch: **vor** dem Ändern fragen, nicht **nach**. Wenn etwas „seltsam" wirkt, ist die Wahrscheinlichkeit hoch, dass es bewusst so gewählt wurde.

---

## Live-Links und Zugänge

- **Live-Site:** https://oasen-finder.vercel.app
- **GitHub-Repo:** https://github.com/restitutio777/oasen-finder
- **GitHub-Account:** `restitutio777` *(User ist eingeloggt)*
- **Vercel:** Account `bolteds-projects`, Projekt `oasen-finder`
- **Lokaler Preview-Server:** `python3 -m http.server 4321` oder via `.claude/launch.json`

---

## Wenn du fragst, antworten

Bei Unsicherheit, **bevor** du etwas Neues vorschlägst:

1. Schau in den bestehenden Code/Repo
2. Lies `PLANUNG.md` für die geplante Richtung
3. Bezieh dich konkret auf das, was schon da ist — nicht von Null neu denken
4. Frag den Auftraggeber, wenn die Anforderung nicht klar ist

— Letzte Aktualisierung: 11. Mai 2026
