import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.5.4:0',
  releaseNotes: {
    en_US:
      'Updates wisp to v0.5.4: fixes a crash (SIGSEGV) that hit the relay a few hours into sustained client traffic, caused by a use-after-free in the inbound connection worker. Confirmed stable across 13+ hours of real load. Carries forward all prior fixes: crash-safe storage, stable Spider upstream connections, no per-IP cap behind the StartOS proxy, and the diagnosable (ReleaseSafe) build.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
