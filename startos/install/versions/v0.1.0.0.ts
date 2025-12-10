import { VersionInfo } from '@start9labs/start-sdk'

export const v_0_4_0_0 = VersionInfo.of({
  version: '0.1.0:0',
  releaseNotes: 'Initial release of Wisp Nostr Relay for StartOS',
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
