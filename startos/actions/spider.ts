import { wispToml } from '../fileModels/wisp.toml'
import { sdk } from '../sdk'
import { i18n } from '../i18n'
import {
  defaultSpiderRelays,
  joinPubkeys,
  npubOrHexPattern,
  pubkeyToHex,
  splitCsv,
} from '../utils'

const { InputSpec, Value, List } = sdk

export const inputSpec = InputSpec.of({
  enabled: Value.toggle({
    name: i18n('Enable Spider'),
    description: i18n(
      'Automatically sync events from the people you follow on other relays.',
    ),
    default: false,
  }),
  admin: Value.text({
    name: i18n('Your Pubkey'),
    description: i18n(
      "Spider fetches this pubkey's contact list and syncs their notes into your relay. Accepts an npub or a 64-character hex key.",
    ),
    required: false,
    default: null,
    placeholder: 'npub1... or hex pubkey',
    patterns: [
      {
        regex: npubOrHexPattern,
        description: i18n('Must be a valid npub or 64-character hex pubkey.'),
      },
    ],
  }),
  relays: Value.list(
    List.text(
      {
        name: i18n('Source Relays'),
        description: i18n(
          'The relays Spider connects to when syncing events. Leave empty to use sensible defaults.',
        ),
      },
      {
        placeholder: 'wss://relay.damus.io',
        patterns: [
          {
            regex: '^wss?://[^,]+$',
            description: i18n('Must be a websocket URL (ws:// or wss://).'),
          },
        ],
      },
    ),
  ),
  pubkeys: Value.list(
    List.text(
      {
        name: i18n('Additional Pubkeys'),
        description: i18n(
          'Extra pubkeys to follow and sync, beyond your contact list. Accepts npub or hex keys.',
        ),
      },
      {
        placeholder: 'npub1... or hex pubkey',
        patterns: [
          {
            regex: npubOrHexPattern,
            description: i18n(
              'Must be a valid npub or 64-character hex pubkey.',
            ),
          },
        ],
      },
    ),
  ),
  sync_interval: Value.number({
    name: i18n('Sync Interval'),
    description: i18n('How often Spider re-syncs from the source relays.'),
    required: false,
    default: 300,
    integer: true,
    min: 30,
    units: 'seconds',
    placeholder: '300',
  }),
})

export const configureSpider = sdk.Action.withInput(
  'configure-spider',

  async ({ effects }) => ({
    name: i18n('Spider Sync'),
    description: i18n(
      'Pull your feed automatically by syncing events from people you follow',
    ),
    warning: i18n('Changes take effect the next time the relay starts.'),
    allowedStatuses: 'any',
    group: 'configure',
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const spider = await wispToml.read((c) => c.spider).once()
    return {
      enabled: spider?.enabled ?? false,
      admin: spider?.admin || null,
      relays: spider?.relays ? splitCsv(spider.relays) : defaultSpiderRelays,
      pubkeys: splitCsv(spider?.pubkeys),
      sync_interval: spider?.sync_interval ?? 300,
    }
  },

  async ({ effects, input }) => {
    const relays = input.relays.length ? input.relays : defaultSpiderRelays
    return wispToml.merge(effects, {
      spider: {
        enabled: input.enabled,
        admin: input.admin ? pubkeyToHex(input.admin) : undefined,
        relays: relays.join(','),
        pubkeys: joinPubkeys(input.pubkeys),
        sync_interval: input.sync_interval ?? undefined,
      },
    })
  },
)
