# Nächste Session — Wiedereinstieg

*Hand-off vom 12. Mai 2026, Session-Ende.*

## In 30 Sekunden: was zu tun ist

1. **Vercel-Cutover wieder anstoßen, aber diesmal mit Node-Version-Fix** *(siehe „Cutover-Plan" unten)*
2. **Falls Cutover läuft:** Smoke-Test der Live-Site, dann sind wir live
3. **Plus parallel:** strategische Items 1-3 unten, je nach Priorität

## Wo wir stehen *(Kurzfassung)*

- **Live:** statisches `index.html` auf [oasen-finder.vercel.app](https://oasen-finder.vercel.app)
- **In `/astro/` vorbereitet, NICHT live:** Astro 5 + Sanity 3, alle Pages, alle Schemas, Demo-Content, lokal 100% gebaut
- **Sanity-Studio live:** <https://werkstatt-gemeinschaft.sanity.studio/> *(Project z6eclgt8)*
- **Letzter Commit auf main:** `6df0315` *(Live-Cutover-Versuch — vercel.json war zu pnpm/Astro umgestellt, dann zurückgerollt auf statisches Setup)*

Siehe `CONTEXT.md` für vollständigen Stand. Siehe `astro/README.md` für Astro-Details.

---

## 1. Vercel-Cutover wieder anstoßen *(Top-Priorität)*

### Was schiefging beim letzten Versuch

Vercel-Build crashed mit:
```
ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/...: 
Value of "this" must be of type URLSearchParams
```

Ursache: Vercel's Build-Image hat als Default-Node vermutlich Node 18 oder 20. Plus pnpm 10. Diese Kombination hat in der pnpm-meta-fetch-Logik einen `URLSearchParams`-Bug.

### Fix-Optionen *(eine wählen, dann pushen)*

**Option A — Node-Version in `package.json` festsetzen** *(saubere Lösung)*

In `astro/package.json` einfügen:
```json
{
  "engines": {
    "node": ">=22"
  },
  "packageManager": "pnpm@10.15.1"
}
```

Plus `.nvmrc` im Repo-Root:
```
22
```

**Option B — Vercel-Project-Settings** *(Browser, ohne Code-Änderung)*

Im Vercel-Dashboard → Project Settings → Environment Variables:
- `NODE_VERSION = 22`

Oder: General → Node.js Version → 22.x.

**Option C — Auf npm umstellen** *(Last Resort, falls A+B fehlschlagen)*

`vercel.json` buildCommand auf:
```json
"buildCommand": "cd astro && npm install --legacy-peer-deps && npm run build"
```

Plus die `pnpm-lock.yaml` ist eh gitignored, also npm baut frisch.

### Cutover-Plan *(Schritt für Schritt)*

```bash
# 1. Fix anwenden (Option A empfohlen)
# astro/package.json um "engines" und "packageManager" ergänzen
# .nvmrc im Root schreiben

# 2. vercel.json wieder auf Astro-Cutover umstellen
# (war im Commit 6df0315 — kopiere zurück)
# Wichtig: trailingSlash: true, buildCommand, outputDirectory

# 3. Lokal nochmal testen
cd astro && pnpm install && pnpm build
# → muss 21 Pages bauen ohne Fehler

# 4. Push
cd ..
git add vercel.json astro/package.json .nvmrc
git commit -m "Vercel-Cutover Retry: Node 22 + Astro-Build aktivieren"
git push origin claude/epic-bhaskara-3b2c19:main

# 5. Vercel-Build beobachten — wenn READY: smoke test
#    Wenn ERROR: Build-Logs prüfen via Vercel-MCP (get_deployment_build_logs)
```

### Was der erfolgreiche Cutover bringt

- Live-Site zeigt 21 Astro-Pages statt statisches `index.html`
- Sanity-Inhalte werden zur Build-Zeit gepullt → echte Detail-Pages
- Leaflet-Karte auf BewegBAR, PortableText-Body in allen Notizen
- Mitkommen-Formular mit 6 Einladungs-Kategorien
- Multi-Page-URLs *(`/schreibbar/fruehjahr-auf-kreta/` usw.)*

---

## 2. Inhalts-Klärungen mit Katharina *(parallel, keine Code-Arbeit)*

Eine Mail an sie mit den 5 verbleibenden Fragen:

1. **Drei Worte für ihren Ton?** *(z.B. „warm, suchend, klar")*
2. **DenkBAR und BrauchBAR — als Sub-Bereich oder eigene Seite?** *(aktuell Sub via `kind`-Filter)*
3. **`wortgetreu.com`:** weiter parallel pflegen oder einmal nach LesBAR importieren?
4. **`anthroposophie-lebensnah`:** noch aktiv? Verlinken oder einstellen?
5. **„Wir" statt „ich"** — wer ist „wir"? *(spielt in alle Texte rein)*

Plus: **Domain-Wunsch** *(P.S. im Fragebogen — antwort noch ausstehend)*. Beispiele aus der Fragebogen-Vorschlagsliste:
- `werkstatt-gemeinschaft.de`
- `werkstatt-gemeinschaft.org`
- `katharina-offenborn.de`
- Eigene Idee von ihr

---

## 3. Echtes Backend für Mitkommen-Formular

Aktuell: `action="mailto:..."` — öffnet den Mail-Client des Users.
Besser: Server-side Submit.

**Realistische Optionen:**

| Tool | Pro | Con |
|---|---|---|
| **Vercel-Function + Resend** | Volle Kontrolle, 100 Mails/Tag free | Mehr Setup, API-Key in env |
| **Web3Forms** | Drop-in, kein Setup, free 250/Monat | Drittanbieter, Privacy |
| **Formspark** | Schön, einfach | Kostet ab gewissem Volumen |
| **Buttondown** | Wenn auch Newsletter dazu | Eigener Account nötig |

**Strategisches Item 2 in CONTEXT.md** ist Newsletter — wenn wir Buttondown/Substack wählen, kann das Mitkommen-Formular dort mit rein.

---

## 4. Weitere offene strategische Items *(siehe PLANUNG.md)*

- **DSGVO/Impressum** — Generator-Lösung *(eRecht24, Datenschutz-Generator)*, vor Soft-Launch zwingend
- **Mindest-Content vor Soft-Launch:** Demo-Records sind drin, aber Katharinas eigene Inhalte sollten ergänzt werden
- **Hub-Logik:** Backlinks von wortgetreu.com, ihren YouTube/Spotify/Apple Music-Profilen auf die neue Site setzen
- **Sanity-Ownership-Transfer auf Katharina** *(sie braucht einen eigenen Account, dann Member-Add + Owner-Transfer)*
- **A11y-Audit + Mobile-Test mit Katharina am Tablet** vor Public-Launch
- **info@-Account als Backup-Admin** im Sanity-Projekt *(Bus-Faktor)*

---

## Wichtige Konventionen *(siehe CONTEXT.md im Detail)*

- **Du-Form** zwischen Auftraggeber und Katharina
- **Deutsche Commit-Messages** mit thematischem Präfix *(„Hero:", „SchreibBAR:", „Brand:")*
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

## Lokale Entwicklung

```bash
# Astro-Frontend
cd astro && pnpm install && pnpm dev    # http://localhost:4321

# Sanity-Studio
cd astro/sanity && pnpm install && pnpm dev   # http://localhost:3333

# Demo-Content neu importieren
cd astro/sanity && pnpm dlx sanity@latest dataset import seed/demo.ndjson --dataset production --replace
```

---

## Was du der neuen Session sagen kannst

> Lies `CONTEXT.md`, `PLANUNG.md`, `NEXT-SESSION.md` und `KATHARINA-ANTWORTEN.md`.
> Wir machen weiter mit dem Vercel-Cutover-Fix (Node-Version), siehe `NEXT-SESSION.md` Schritt 1.

Damit ist sie/er innerhalb von ~3 Minuten orientiert.
