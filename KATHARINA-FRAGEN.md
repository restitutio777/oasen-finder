# Offene Fragen an Katharina

*Stand: 12. Mai 2026. Diese Liste wächst, sobald in Sessions neue Klärungs-Themen aufkommen. Bei Beantwortung in `KATHARINA-ANTWORTEN.md` verschieben.*

---

## 1. Substack-Publikation — URL bestätigen

Du hattest mir `https://substack.com/@katharinaoffenborn` geschickt — das ist dein **Profil**. Für das Newsletter-Anmelde-Formular auf der Seite brauche ich die **Publikation-URL**, also der Teil vor `.substack.com`.

Annahme aktuell im Code: `katharinaoffenborn.substack.com`

Bitte einmal in deinem Substack-Dashboard prüfen:
- Hast du schon eine Publikation angelegt? *(„Start your Substack")*
- Wenn ja: wie lautet die URL? *(z.B. `werkstatt.substack.com` oder `briefvonkatharina.substack.com`)*
- Wenn nein: lege eine an, dann setzen wir die URL in Sanity → Mitkommen-Formular-Konfig

## 2. denkBAR + brauchBAR — eigene Räume oder versteckt?

Aktueller Stand: beide sind **Sub-Bereiche** der vorhandenen Räume:
- denkBAR-Einträge *(Ideen, Visionen, Umfragen)* werden in **schreibBAR** angelegt
- brauchBAR-Einträge *(Konzepte, Werkzeuge)* werden in **lesBAR** angelegt

Frage: Sollen denkBAR und brauchBAR **eigene Räume in der Navigation** werden *(eigener Tab oben, eigene Detail-Seiten)* — oder bleibt es bei den Sub-Bereichen? *(Sub-Variante ist einfacher und für den Anfang übersichtlicher.)*

## 3. Eigene Inhalte — Bio + erste Notizen

Aktuell ist auf der Seite Demo-Content. Was wir von dir bräuchten *(in deinem Tempo)*:

- **Bio** *(3–4 Sätze)* für die erkennBAR-Seite. Im Sanity-Studio: „erkennBAR — Über mich" → Kurz-Bio.
- **Anliegens-Satz** *(ein-zwei Sätze)* — was treibt dich an, was suchst du?
- **2–3 Notizen** aus deiner Sammlung — Gedichte, Gedanken, Reisefragmente. Eine reicht für den Anfang.
- **2–3 Stationen** aus den Orten wo du warst — mit kurzem Eindruck + Foto.
- **1–2 echte Werkstatt-Termine** — sobald geplant.

## 4. „Wir reisen" — wer ist „wir"?

Aktuelle Annahme: **Katharina + Carla** als „wir". Philippe oder andere im Verlauf möglich.

Frage offen: bleibt es bei euch beiden, oder kommt jemand dazu? *(Das prägt alle Bio-Texte und Section-Subtitles — kein blockierender Punkt, aber gut, wenn wir es wissen.)*

## 5. Upload-Formate — bestätigen

Was du jetzt im Sanity hochladen kannst:

**Bilder** *(automatisch optimiert, du brauchst nichts einzustellen)*:
- JPEG · PNG · GIF · WebP · AVIF · HEIC *(iPhone-Standard)* · SVG

Sanity macht die Optimierung selbstständig:
- Format-Konvertierung *(zu WebP/AVIF wo möglich)*
- Mehrere Größen für verschiedene Bildschirme
- Lazy-Loading
- Du musst die Bilder **nicht** vorher verkleinern — Sanity ist da deine Werkstatt.

**Dokumente** *(als Anhang verlinkbar)*:
- PDF *(empfohlen, öffnet sich direkt im Browser)*
- Word *(.doc, .docx)*
- OpenDocument *(.odt)*
- Reiner Text *(.txt)*

Frage: brauchst du **andere Formate** *(z.B. Audio-Dateien zum Direkt-Hochladen statt YouTube-Link, Video, etc.)*? Aktuell sind Audio/Video als externe Plattform-Links *(hörBAR-Eintrag mit YouTube/Spotify/Apple-URL)* eingerichtet — solltest du das anders wollen, sag bescheid.

## ✨ Neu: Menschen einfach erwähnen + verlinken

Im Sanity-Studio gibt's jetzt einen neuen Bereich **„Menschen — wen du in Texten erwähnst"**. Das macht dein Verlinken einfacher:

1. **Einmal anlegen:** Sidebar → „Menschen" → „Create". Trägst Name + Foto + Haupt-Webseite ein *(z.B. Anna mit Link zu Tempelhof oder ihre Substack-Seite)*. Dauert 30 Sek.
2. **In jedem Beitrag verwenden:** Im Text-Feld markierst du das Wort *(„Anna")*, klickst den Annotation-Button → „Mensch erwähnen" → wählst Anna aus deiner Liste.
3. **Im Frontend:** Erscheint als dezenter Link in warmer Akzent-Farbe. Klick → führt zu Annas Hauptseite.

**Vorteil:** Wenn Anna ihre URL ändert *(z.B. neue Webseite)*, passt du das **einmal** bei „Menschen" an — alle Beiträge, in denen du sie erwähnst, sind automatisch aktualisiert. Kein Suchen-und-Ersetzen.

Wenn du nur einen einmaligen externen Link einfügen willst *(ohne Person-Eintrag)*: weiterhin der normale Link-Button im Text-Editor.

---

## 6. Telegram-Channel oder -Gruppe?

Wenn du einen Telegram-Channel hast *(oder anlegen willst)*, kann ich den dezent im Footer mit Telegram-Icon verlinken. Plus: in jedem Beitrag *(Notiz, Quelle, etc.)*, wenn du einen Telegram-Link einträgst, wird er als hübsche Card mit dem Telegram-Logo gerendert — nicht als nackter Link.

Bitte gib die volle URL: `https://t.me/<dein-name>` *(oder leer lassen wenn nicht gewünscht — Telegram-Anzeige bleibt dann ausgeblendet)*.

## 7. Domain — wie soll die Adresse heißen?

Beispiele aus dem Fragebogen:
- `werkstatt-gemeinschaft.de` *(oder .org)*
- `katharina-offenborn.de`
- eigene Idee

Sobald du eine Tendenz hast, kaufe ich die Domain in deinem Namen *(ca. 10–15 € im Jahr)* und richte sie bei Vercel + Resend ein.

---

## Aktueller Anwendungsfall pro Klärung

| Frage | Wozu nötig |
|---|---|
| Substack-URL | Newsletter-Block muss korrekte Subdomain ansprechen — falsche URL → leeres Formular |
| denkBAR/brauchBAR | Letzte offene Navigations-Architektur-Frage |
| Eigene Inhalte | Demo-Content kann ersetzt werden, Site wirkt nicht mehr „Show-Modus" |
| „Wir"-Definition | Ich kann konsistente Texte schreiben |
| Upload-Wünsche | falls Audio/Video-Direkt-Upload gewünscht: Sanity bietet das, aktuell nicht eingerichtet |
| Domain | Dann gehen Resend-Mails von der echten Adresse, plus Impressum stimmt |
