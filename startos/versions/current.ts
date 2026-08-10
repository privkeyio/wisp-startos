import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.5.15:0',
  releaseNotes: {
    en_US:
      'Updates wisp to v0.5.15. Fixes a WebSocket connection-slot leak in the HTTP layer that could exhaust a worker and wedge the relay\'s accept loop under sustained load, so the relay stops accepting new connections while the process stays up. Fixes a related WebSocket union crash under heavy single-worker churn. Adds a self-healing watchdog that restarts the relay if it ever stops accepting connections. Carries forward every prior fix.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
