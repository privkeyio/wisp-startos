import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { relayPort, storagePath } from '../utils'

// The shape of wisp.toml. wisp's TOML parser only understands flat scalar
// values (strings, numbers, booleans) under [section] headers, so comma-
// separated lists (relays, ip allow/deny, follow pubkeys) are stored as
// strings here and joined from list inputs in the Actions.
export const shape = z.object({
  server: z
    .object({
      host: z.literal('0.0.0.0').catch('0.0.0.0'),
      port: z.literal(relayPort).catch(relayPort),
    })
    .catch({ host: '0.0.0.0', port: relayPort }),
  relay: z
    .object({
      name: z.string().optional().catch(undefined),
      description: z.string().optional().catch(undefined),
      pubkey: z.string().optional().catch(undefined),
      contact: z.string().optional().catch(undefined),
    })
    .optional()
    .catch(undefined),
  storage: z
    .object({
      path: z.literal(storagePath).catch(storagePath),
      map_size_mb: z.number().optional().catch(undefined),
    })
    .catch({ path: storagePath }),
  limits: z
    .object({
      max_connections: z.number().optional().catch(undefined),
      max_subscriptions: z.number().optional().catch(undefined),
      max_filters: z.number().optional().catch(undefined),
      max_message_size: z.number().optional().catch(undefined),
      max_event_tags: z.number().optional().catch(undefined),
      max_content_length: z.number().optional().catch(undefined),
      query_limit_default: z.number().optional().catch(undefined),
      query_limit_max: z.number().optional().catch(undefined),
      max_event_age: z.number().optional().catch(undefined),
      max_future_seconds: z.number().optional().catch(undefined),
      min_pow_difficulty: z.number().optional().catch(undefined),
    })
    .optional()
    .catch(undefined),
  timeouts: z
    .object({
      idle_seconds: z.number().optional().catch(undefined),
    })
    .optional()
    .catch(undefined),
  rate_limits: z
    .object({
      events_per_minute: z.number().optional().catch(undefined),
    })
    .optional()
    .catch(undefined),
  auth: z
    .object({
      required: z.boolean().optional().catch(undefined),
      to_write: z.boolean().optional().catch(undefined),
      relay_url: z.string().optional().catch(undefined),
    })
    .optional()
    .catch(undefined),
  security: z
    .object({
      trust_proxy: z.boolean().optional().catch(undefined),
      max_connections_per_ip: z.number().optional().catch(undefined),
      ip_whitelist: z.string().optional().catch(undefined),
      ip_blacklist: z.string().optional().catch(undefined),
    })
    .optional()
    .catch(undefined),
  spider: z
    .object({
      enabled: z.boolean().optional().catch(undefined),
      relays: z.string().optional().catch(undefined),
      admin: z.string().optional().catch(undefined),
      pubkeys: z.string().optional().catch(undefined),
      sync_interval: z.number().optional().catch(undefined),
    })
    .optional()
    .catch(undefined),
  negentropy: z
    .object({
      enabled: z.boolean().optional().catch(undefined),
      max_sync_events: z.number().optional().catch(undefined),
    })
    .optional()
    .catch(undefined),
  management: z
    .object({
      admin_pubkeys: z.string().optional().catch(undefined),
    })
    .optional()
    .catch(undefined),
})

export const wispToml = FileHelper.toml(
  {
    base: sdk.volumes.config,
    subpath: '/wisp.toml',
  },
  shape,
)
