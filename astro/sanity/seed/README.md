# Initial-Demo-Content für Sanity

`demo.ndjson` enthält 10 Initial-Records — sofort startklar nach dem Schema-Deploy.

## Was drin ist

| Dokument | Typ | Zweck |
|---|---|---|
| `about` | erkennBAR | Singleton mit Katharinas Bio, Mantra, Prägungen, Saisonalität, Don't-Liste |
| `contact` | Mitkommen | Singleton mit den 7 Einladungs-Kategorien (Interview inaktiv) |
| `note-fruehjahr-auf-kreta` | SchreibBAR | Notiz vom 23.04.2026 |
| `note-filzen-im-tempelhof` | SchreibBAR | Notiz vom 14.03.2026 |
| `note-vor-sonnenaufgang` | SchreibBAR · Poesie | Gedicht vom 12.02.2026 |
| `station-kreta` | BewegBAR | Kreta-Station mit Koordinaten |
| `station-tempelhof` | BewegBAR | Tempelhof, Hohenlohe |
| `event-sommer-2026` | MachBAR | Sommer-Werkstatt 15.-17. Juli, hundefreundlich (Carla) |
| `resource-wortgetreu` | LesBAR | Verlinkung auf wortgetreu.com |
| `resource-dreigliederung` | LesBAR · Konzept | Steiner-Dreigliederung als Frage |

## Import

```bash
cd astro/sanity
pnpm dlx sanity@latest dataset import seed/demo.ndjson production --replace
```

Das `--replace`-Flag überschreibt existierende Records mit gleichem `_id` —
nützlich für Iterationen während des Setups.

Erste Voraussetzung: Im Browser via `pnpm dev` einmal ins Studio eingeloggt
sein, damit der lokale CLI-Cache die Auth hat.

## Was Katharina später ergänzt

- **Echte Fotos** (aktuell nur Text — `hero`/`portraits`/`images` leer)
- **FR/EN-Übersetzungen** (aktuell nur DE)
- **Mehr Stationen** aus ihren Reisetagebüchern
- ~~**Echte Mail-Adresse** im `contact.emailRecipient`~~ ✅ erledigt (`kontakt@reise-zueinander.de`)
