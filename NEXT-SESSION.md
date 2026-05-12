# Nächste Session — Wiedereinstieg

*Hand-off vom 12. Mai 2026, Abend. Cutover live + Mitkommen-Backend angelegt.*

## In 30 Sekunden: was zu tun ist

1. **Resend aktivieren** — Account anlegen, API-Key in Vercel-Env, dann Mitkommen-Mails gehen wirklich raus *(siehe Schritt 1 unten)*
2. **Mail an Katharina** mit den 5 offenen inhaltlichen Fragen + Domain-Wunsch *(parallel, asynchron, siehe Schritt 2)*
3. **Strategische Items 3-7** je nach Priorität *(DSGVO, Hub-Logik, Ownership-Transfer, A11y, Bus-Faktor)*

## Wo wir stehen *(Kurzfassung)*

- **Live auf [oasen-finder.vercel.app](https://oasen-finder.vercel.app):** komplette Astro-Multi-Page-Site mit 21 Routen, Sanity-Content im Build, Leaflet-Karte, Mitkommen-Form mit echtem Server-Submit
- **Sanity-Studio live:** <https://werkstatt-gemeinschaft.sanity.studio/> *(Project z6eclgt8)*
- **Stack auf Vercel:** Astro 5 + npm + Node 22+, `package-lock.json` eingecheckt → reproducible
- **Letzter Commit:** `1bd9891` *(Vercel-Cutover: pnpm → npm Wechsel + package-lock.json eingecheckt)* — plus die folgenden Doku-Updates

Vollständiger Stand siehe `CONTEXT.md`. Astro-Details in `astro/README.md`.

---

## 1. Resend aktivieren — Mitkommen-Mails wirklich versenden

### Status jetzt

Die Vercel-Function `/api/mitkommen.ts` ist live. Sie:

- nimmt POST-Requests vom Formular entgegen,
- validiert Pflichtfelder (Name, Mail, Nachricht) und Mail-Format,
- filtert Bots via Honeypot-Feld `_hp`,
- baut die Mail (Subject + Plain-Text-Body mit allen Anliegen-Kategorien).

**Solange `RESEND_API_KEY` nicht gesetzt ist:** Function läuft im **Log-Modus** — schreibt die Anfrage nur in die Vercel-Function-Logs und gibt dem User trotzdem ein „Danke" zurück. Heißt: das Formular *funktioniert sichtbar*, aber bei dir kommt noch keine Mail an.

### Schritte zur Aktivierung

1. **Resend-Account anlegen** — <https://resend.com> *(free 3000 Mails/Monat, 100/Tag)*
2. **API-Key generieren** im Dashboard → Settings → API Keys → „Create API Key" → Name: `werkstatt-gemeinschaft-prod` → Permission: „Sending access" → Domains: alle
3. **Domain bei Resend verifizieren** *(optional aber empfohlen)* — wenn `werkstatt-gemeinschaft.de` (oder welche Domain Katharina entscheidet) feststeht: Resend → Domains → Add → DNS-Einträge bei Domain-Registrar setzen *(SPF, DKIM, MX)*. Bis dahin: `onboarding@resend.dev` als Absender — Resend lässt das für Tests zu.
4. **In Vercel-Project-Settings → Environment Variables** *(Production scope)*:
   - `RESEND_API_KEY` = `re_xxxxx...` *(der Key aus Schritt 2)*
   - `MITKOMMEN_TO` = `kontakt@werkstatt-gemeinschaft.de` *(oder bevorzugte Mail von Katharina — wird Empfänger)*
   - `MITKOMMEN_FROM` = `mitkommen@werkstatt-gemeinschaft.de` *(verifizierter Absender, ggf. erst `onboarding@resend.dev` bis Domain steht)*
5. **Re-deploy auslösen** — entweder Push eines kleinen Commits, oder im Vercel-Dashboard „Redeploy" beim aktuellen Build.
6. **Test:** auf <https://oasen-finder.vercel.app/mitkommen/> ein Testformular absenden → Mail muss bei `MITKOMMEN_TO` ankommen.

### Anti-Spam — was schon eingebaut ist

- **Honeypot-Feld** `_hp` (versteckt für Menschen, Bots füllen es aus → Anfrage wird silently verworfen)
- **Mail-Format-Check** via Regex
- **Pflichtfeld-Validation** server-seitig
- Reply-To wird auf Katharinas Mail-Adresse gesetzt → einfacher zurückschreiben

### Spätere Verbesserungen *(nicht jetzt)*

- Rate-Limiting per IP *(z.B. via Vercel KV oder Upstash Redis)*
- Captcha-Alternative *(hCaptcha) falls Spam überhand nimmt*
- Auto-Reply an den Absender *(zweite Resend-Mail an `reply_to`)*

---

## 2. Mail an Katharina — die 5 offenen Inhalts-Fragen + Domain

Sie antwortet asynchron, kein Druck — aber wir können nicht weiter sauber befüllen, bis das geklärt ist.

**Fragen für die Mail:**

1. **Drei Worte für deinen Ton?** *(z.B. „warm, suchend, klar" — die landen in CSS-Kommentaren, Meta-Description, später vielleicht im erkennBAR-Header)*
2. **DenkBAR und BrauchBAR** — als Sub-Bereich *(aktuell via `kind`-Filter in SchreibBAR/LesBAR)* oder als eigene Seiten?
3. **`wortgetreu.com`** *(deine Gedicht-Sammlung, TYPO3)*: weiter parallel pflegen oder einmal alles nach LesBAR importieren? *(Pragmatischer Start ist: nur verlinken.)*
4. **`anthroposophie-lebensnah`** *(deine Site ab 2010)*: noch aktiv? Verlinken oder einstellen?
5. **„Wir" statt „ich"** — wer ist „wir"? *(in der Bio steht „wir reisen" — wer reist mit? Carla, Familie, eine Gemeinschaft? Das beeinflusst alle Texte.)*

**Plus: Domain-Wunsch** *(P.S. im Fragebogen, Antwort steht noch aus)*. Beispiele:
- `werkstatt-gemeinschaft.de`
- `werkstatt-gemeinschaft.org`
- `katharina-offenborn.de`
- Eigene Idee von ihr

---

## 3. Strategische Items *(je nach Priorität)*

### DSGVO + Impressum *(vor Public-Launch zwingend)*

- **Generator-Lösung** für den Start: eRecht24, Datenschutz-Generator
- Impressum: Name, Anschrift, Mail, ggf. USt-IdNr.
- Datenschutz: standard *(Vercel = US-Host, Resend = US, Sanity = EU)* — Generator deckt das ab
- Beide Seiten existieren als Astro-Pages *(`/impressum/`, `/datenschutz/`)*, aktuell leer — Inhalte rein, fertig

### Sanity-Ownership-Transfer auf Katharina

1. Katharina legt sich Sanity-Account an *(eigener Gmail/Posteo etc.)*
2. Sanity-Dashboard → Project `z6eclgt8` → Members → Add Member → ihre Mail
3. Sobald sie hinzugefügt ist: ihr „Owner" geben *(Dropdown bei ihrem Eintrag)*
4. **Vorher** noch: `info@intuitive-fotografie.de` als zweiten Admin hinzufügen → Bus-Faktor abgesichert

### A11y-Audit + Mobile-Test

- **Lighthouse-Run** auf alle 21 Pages *(via Vercel: PR-Lighthouse-Reports aktivieren, oder lokal `npx unlighthouse`)*
- **Kontrast-Check** Aubergine-auf-Linen + Honig-Gold-CTAs
- **Italic-Cormorant** in 14-16px lesbar? Bei Ende-60-Zielgruppe nicht annehmen, prüfen
- **Touch-Targets** ≥ 44 px *(Nav, CTAs, Form-Checkboxen)*
- **Mit Katharina am Tablet testen** — sie ist die echte Zielgruppe

### Hub-Logik *(Backlinks setzen)*

- Bestehende Sites *(wortgetreu.com, anthroposophie-lebensnah)*: Link in Sidebar/Footer auf neue Site
- YouTube/Spotify/Apple-Music-Profile *(sobald aktiv)*: Bio-Link → neue Site
- Substack *(wenn Newsletter darüber läuft)*: Profil-Link

### Newsletter *(strategisches Item 2)*

Tool-Entscheidung steht noch aus:
- **Buttondown** *(klein, fein, DSGVO-freundlich)*
- **Substack** *(Reichweite, Discovery)*
- **MailerLite** *(volle Kontrolle)*

Wenn Newsletter klar ist, kann das Mitkommen-Formular eine optionale „Auch in den Newsletter eintragen"-Checkbox bekommen.

---

## Wichtige Konventionen *(siehe CONTEXT.md im Detail)*

- **Du-Form** zwischen Auftraggeber und Katharina
- **Deutsche Commit-Messages** mit thematischem Präfix *(„Mitkommen:", „Doku:", „A11y:")*
- **Atomare Commits bei klaren Meilensteinen** *(siehe „Commit-Workflow" in CONTEXT.md)*
- **Brand-Farben:**
  - `--accent-gold: #c08538` *(Hero-Frage, CTAs, WERK-Silbe)*
  - `--accent-warm: #c98a4a` *(Brand-Familie, Headlines, Tags)*
  - `--accent: #a8392b` *(Clay-Rot, reserviert für seltene Aktionen)*
- **Nie pushen auf `main` ohne expliziten Auftrag**
- **„Niemals reflexartig vereinfachen"** *(Don't #8)* — Iterationen sind oft absichtlich

## Wichtige Links

| | URL |
|---|---|
| Live-Site | <https://oasen-finder.vercel.app> |
| GitHub | <https://github.com/restitutio777/oasen-finder> |
| Vercel-Dashboard | <https://vercel.com/bolteds-projects/oasen-finder> |
| Sanity-Studio | <https://werkstatt-gemeinschaft.sanity.studio/> |
| Sanity-Dashboard | <https://www.sanity.io/manage/project/z6eclgt8> |
| Resend *(zu erstellen)* | <https://resend.com> |

## Lokale Entwicklung

```bash
# Astro-Frontend
cd astro && npm install && npm run dev    # http://localhost:4321

# Sanity-Studio
cd astro/sanity && pnpm install && pnpm dev   # http://localhost:3333

# Funktions-Test (Mitkommen lokal mit echtem POST)
npx vercel dev   # im Repo-Root, simuliert /api/mitkommen

# Demo-Content neu importieren
cd astro/sanity && pnpm dlx sanity@latest dataset import seed/demo.ndjson --dataset production --replace
```

---

## Was du der neuen Session sagen kannst

> Lies `CONTEXT.md`, `PLANUNG.md`, `NEXT-SESSION.md` und `KATHARINA-ANTWORTEN.md`.
> Die Site ist live; nächster Top-Schritt ist Resend aktivieren *(`NEXT-SESSION.md` Schritt 1)*.

Damit ist sie/er innerhalb von ~3 Minuten orientiert.
