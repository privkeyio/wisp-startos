import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.5.10:1',
  releaseNotes: {
    en_US:
      'Test build: wisp built from upstream main HEAD (d96bd0e) past the v0.5.10 tag — includes connection reaping + SO_KEEPALIVE (#136), idle-close slot reclaim (#133), spider staleness watchdog (#132), and shutdown-aware spider bootstrap (#137).',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
