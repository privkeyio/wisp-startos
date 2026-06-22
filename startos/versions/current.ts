import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.5.5:0',
  releaseNotes: {
    en_US:
      'Updates wisp to v0.5.5. No behavior change from v0.5.4: wisp now builds against the upstream http.zig and websocket.zig libraries instead of temporary forks, since all of its fixes have been merged upstream. Carries forward every prior fix: the inbound-worker crash fix, crash-safe storage, stable Spider upstream connections, no per-IP cap behind the StartOS proxy, and the diagnosable (ReleaseSafe) build.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
