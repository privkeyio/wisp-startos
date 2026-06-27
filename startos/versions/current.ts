import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.5.7:0',
  releaseNotes: {
    en_US:
      'Updates wisp to v0.5.7. Fixes a crash (SIGSEGV) on shutdown when a query was still streaming as the relay stopped, for example during a backup: the connection worker tore down storage while a query was still reading it. Also includes the v0.5.6 fix: WebSocket connections rejected by the connection limiter now return HTTP 429 or 503 instead of a 500, so external monitors no longer report the relay down when only a connection is refused. Carries forward every prior fix: the inbound-worker crash fix, crash-safe storage, stable Spider upstream connections, no per-IP cap behind the StartOS proxy, and the diagnosable (ReleaseSafe) build.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
