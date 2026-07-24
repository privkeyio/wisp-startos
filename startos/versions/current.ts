import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.5.14:1',
  releaseNotes: {
    en_US:
      'Updates wisp to v0.5.14. Queries are now bounded in how many stored entries they may scan, so a selective filter matching fewer events than its limit no longer walks the entire database. This fixes severe CPU and major page-fault load on large databases. The new query_scan_multiplier setting (default 20, 0 to disable) controls the bound. Carries forward every prior fix.',
  },
  // No data-format change between these versions, so both directions are no-ops.
  // `down` must stay migratable: if it is IMPOSSIBLE, a cancelled or failed
  // update cannot be rolled back and StartOS wedges the service instead of
  // reverting (the data version is stamped before the update completes).
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
