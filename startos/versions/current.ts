import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.5.1:0',
  releaseNotes: {
    en_US:
      'Updates wisp to v0.5.1 with crash-safe storage by default (durable writes that no longer risk corruption on power loss). Fixes Spider freezing your feed: productive but short-lived upstream connections no longer escalate into multi-hour reconnect blackouts. Also fixes the relay being capped at 10 connections behind the StartOS reverse proxy by no longer limiting connections per IP, matching how nostr-rs-relay and strfry are packaged.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
