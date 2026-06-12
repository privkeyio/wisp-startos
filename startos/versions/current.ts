import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.4.0:0',
  releaseNotes: {
    en_US:
      'Updates wisp to v0.4.0: an epoll worker-pool I/O model that keeps memory flat under connection churn (replacing the thread-per-connection model), built on Zig 0.16.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
