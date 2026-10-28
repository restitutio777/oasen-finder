import { defineCliConfig } from 'sanity/cli';

/**
 * CLI-Konfiguration für Sanity-Befehle wie:
 *   sanity dataset import
 *   sanity deploy
 *   sanity graphql deploy
 *   sanity migration run
 *
 * Liest Project-ID + Dataset für den CLI. Ohne diese Datei meldet die
 * CLI „No CLI config found".
 */
export default defineCliConfig({
  api: {
    projectId: 'z6eclgt8',
    dataset: 'production',
  },
  // optional: studio-host für `sanity deploy`-Default
  studioHost: 'werkstatt-gemeinschaft',

  /**
   * Automatische Updates für das deployte Studio (28.10.26).
   *
   * Das Studio lädt seine Sanity-Kernmodule zur Laufzeit von Sanitys CDN
   * statt sie fest in den Build zu backen. Neue Patch- und Minor-Versionen
   * kommen damit von selbst an, ohne Deploy — und ohne dass Katharina je
   * ein veraltetes Studio bedient.
   *
   * Was es NICHT abdeckt: Major-Versionen mit Verhaltensänderungen (v6 → v7)
   * bleiben Handarbeit, ebenso der eigene Code hier — Schemas,
   * AutoSlugPublishAction, die Icon-Importe. Der Sprung 3.99 → 6.20 am
   * 28.10. war genau so ein Fall.
   *
   * `appId` braucht es nur für die Kanalwahl (latest / stable / next /
   * feste Version) in sanity.io/manage → Studios. Steht auf „latest".
   */
  deployment: {
    appId: 's46mw9a9tr31l8ffcu1sysv2',
    autoUpdates: true,
  },
});
