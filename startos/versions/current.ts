import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.5.13:1',
  releaseNotes: {
    en_US:
      'Test build: wisp built from upstream main HEAD (7c07362) past the v0.5.13 tag — adds a query scan cap that bounds how many entries a query may scan, preventing full-database page-fault thrash.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
