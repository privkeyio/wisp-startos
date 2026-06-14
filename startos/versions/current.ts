import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.5.0:0',
  releaseNotes: {
    en_US:
      'Updates wisp to v0.5.0: crash-safe storage by default. Writes are now durable so the database no longer risks corruption on power loss, using a group-commit writer that batches writes so durability scales with load. Durability stays configurable for operators who want maximum throughput.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
