import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.2.2:0',
  releaseNotes: {
    en_US:
      'Initial release of Wisp for StartOS 0.4.0. Packages the wisp Nostr relay (v0.2.2) with configuration through Actions: relay information, Spider sync, limits, and access control.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
