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
});
