import { wispToml } from '../fileModels/wisp.toml'
import { sdk } from '../sdk'
import { i18n } from '../i18n'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  max_connections: Value.number({
    name: i18n('Max Connections'),
    description: i18n('Maximum number of concurrent client connections.'),
    required: false,
    default: null,
    integer: true,
    min: 1,
    units: 'connections',
    placeholder: '1000',
  }),
  max_connections_per_ip: Value.number({
    name: i18n('Max Connections Per IP'),
    description: i18n(
      'Maximum concurrent connections from a single IP address.',
    ),
    required: false,
    default: null,
    integer: true,
    min: 1,
    units: 'connections',
    placeholder: '10',
  }),
  max_subscriptions: Value.number({
    name: i18n('Max Subscriptions'),
    description: i18n('Maximum number of subscriptions per connection.'),
    required: false,
    default: null,
    integer: true,
    min: 1,
    units: 'subscriptions',
    placeholder: '20',
  }),
  max_filters: Value.number({
    name: i18n('Max Filters'),
    description: i18n('Maximum number of filters per subscription.'),
    required: false,
    default: null,
    integer: true,
    min: 1,
    units: 'filters',
    placeholder: '10',
  }),
  max_message_size: Value.number({
    name: i18n('Max Message Size'),
    description: i18n('Maximum size of an incoming websocket message.'),
    required: false,
    default: null,
    integer: true,
    min: 1024,
    units: 'bytes',
    placeholder: '65536',
  }),
  max_content_length: Value.number({
    name: i18n('Max Content Length'),
    description: i18n('Maximum length of an event content field.'),
    required: false,
    default: null,
    integer: true,
    min: 1,
    units: 'bytes',
    placeholder: '102400',
  }),
  max_event_tags: Value.number({
    name: i18n('Max Event Tags'),
    description: i18n('Maximum number of tags allowed on a single event.'),
    required: false,
    default: null,
    integer: true,
    min: 1,
    units: 'tags',
    placeholder: '2000',
  }),
  events_per_minute: Value.number({
    name: i18n('Events Per Minute'),
    description: i18n('Maximum events a single client may publish per minute.'),
    required: false,
    default: null,
    integer: true,
    min: 1,
    units: 'events/min',
    placeholder: '120',
  }),
  query_limit_default: Value.number({
    name: i18n('Default Query Limit'),
    description: i18n('Default number of events returned for a query.'),
    required: false,
    default: null,
    integer: true,
    min: 1,
    units: 'events',
    placeholder: '500',
  }),
  query_limit_max: Value.number({
    name: i18n('Max Query Limit'),
    description: i18n('Maximum number of events returned for a query.'),
    required: false,
    default: null,
    integer: true,
    min: 1,
    units: 'events',
    placeholder: '5000',
  }),
  idle_seconds: Value.number({
    name: i18n('Idle Timeout'),
    description: i18n('Disconnect connections idle for longer than this.'),
    required: false,
    default: null,
    integer: true,
    min: 1,
    units: 'seconds',
    placeholder: '300',
  }),
  min_pow_difficulty: Value.number({
    name: i18n('Minimum Proof of Work'),
    description: i18n(
      'Require this NIP-13 proof-of-work difficulty on incoming events. 0 disables the requirement.',
    ),
    required: false,
    default: null,
    integer: true,
    min: 0,
    max: 255,
    units: 'bits',
    placeholder: '0',
  }),
})

export const configureLimits = sdk.Action.withInput(
  'configure-limits',

  async ({ effects }) => ({
    name: i18n('Limits'),
    description: i18n(
      'Tune throughput and resource limits to protect your relay from abuse',
    ),
    warning: i18n('Changes take effect the next time the relay starts.'),
    allowedStatuses: 'any',
    group: 'configure',
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const data = await wispToml.read().once()
    const limits = data?.limits ?? {}
    return {
      max_connections: limits.max_connections,
      max_subscriptions: limits.max_subscriptions,
      max_filters: limits.max_filters,
      max_message_size: limits.max_message_size,
      max_content_length: limits.max_content_length,
      max_event_tags: limits.max_event_tags,
      query_limit_default: limits.query_limit_default,
      query_limit_max: limits.query_limit_max,
      min_pow_difficulty: limits.min_pow_difficulty,
      max_connections_per_ip: data?.security?.max_connections_per_ip,
      events_per_minute: data?.rate_limits?.events_per_minute,
      idle_seconds: data?.timeouts?.idle_seconds,
    }
  },

  async ({ effects, input }) => {
    const {
      max_connections_per_ip,
      events_per_minute,
      idle_seconds,
      ...limits
    } = input
    return wispToml.merge(effects, {
      limits: nullsToUndefined(limits),
      security: { max_connections_per_ip: max_connections_per_ip ?? undefined },
      rate_limits: { events_per_minute: events_per_minute ?? undefined },
      timeouts: { idle_seconds: idle_seconds ?? undefined },
    })
  },
)

function nullsToUndefined<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === null ? undefined : v]),
  )
}
