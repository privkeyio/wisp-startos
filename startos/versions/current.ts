import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.5.3:0',
  releaseNotes: {
    en_US:
      'Updates wisp to v0.5.3: Spider now keeps its connections to upstream relays open and streaming instead of repeatedly reconnecting, so your feed stays current with far less churn. Includes the earlier crash-safe storage, Spider feed-freeze fix, removal of the per-IP connection cap behind the StartOS proxy, and a diagnosable (ReleaseSafe) build.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
