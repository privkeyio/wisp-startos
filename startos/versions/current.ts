import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.5.2:0',
  releaseNotes: {
    en_US:
      'Updates wisp to v0.5.2: a further Spider reliability fix so connections to wss upstream relays stay open across quiet periods instead of dropping and reconnecting. Includes the v0.5.1 improvements: crash-safe storage by default, Spider no longer freezing your feed, and removal of the per-IP connection cap behind the StartOS reverse proxy.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
