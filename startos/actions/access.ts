import { wispToml } from '../fileModels/wisp.toml'
import { sdk } from '../sdk'
import { i18n } from '../i18n'
import { joinPubkeys, npubOrHexPattern, splitCsv } from '../utils'

const { InputSpec, Value, List } = sdk

export const inputSpec = InputSpec.of({
  auth_required: Value.toggle({
    name: i18n('Require Authentication'),
    description: i18n(
      'Require clients to authenticate (NIP-42) before reading or writing.',
    ),
    default: false,
  }),
  auth_to_write: Value.toggle({
    name: i18n('Require Authentication to Write'),
    description: i18n(
      'Require clients to authenticate (NIP-42) before publishing events.',
    ),
    default: false,
  }),
  admin_pubkeys: Value.list(
    List.text(
      {
        name: i18n('Management Pubkeys'),
        description: i18n(
          'Pubkeys permitted to manage the relay over NIP-86. Accepts npub or hex keys.',
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
  ip_whitelist: Value.list(
    List.text(
      {
        name: i18n('IP Allowlist'),
        description: i18n(
          'If set, only these IP address prefixes may connect. All others are rejected.',
        ),
      },
      {
        placeholder: '192.168.1',
        patterns: [
          {
            regex: '^[^,\\s]+$',
            description: i18n('Must not contain commas or spaces.'),
          },
        ],
      },
    ),
  ),
  ip_blacklist: Value.list(
    List.text(
      {
        name: i18n('IP Blocklist'),
        description: i18n('IP address prefixes that are always rejected.'),
      },
      {
        placeholder: '10.0.0',
        patterns: [
          {
            regex: '^[^,\\s]+$',
            description: i18n('Must not contain commas or spaces.'),
          },
        ],
      },
    ),
  ),
})

export const configureAccess = sdk.Action.withInput(
  'configure-access',

  async ({ effects }) => ({
    name: i18n('Access Control'),
    description: i18n(
      'Require authentication and restrict which clients may connect',
    ),
    warning: i18n('Changes take effect the next time the relay starts.'),
    allowedStatuses: 'any',
    group: 'configure',
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const data = await wispToml.read().once()
    return {
      auth_required: data?.auth?.required ?? false,
      auth_to_write: data?.auth?.to_write ?? false,
      admin_pubkeys: splitCsv(data?.management?.admin_pubkeys),
      ip_whitelist: splitCsv(data?.security?.ip_whitelist),
      ip_blacklist: splitCsv(data?.security?.ip_blacklist),
    }
  },

  async ({ effects, input }) =>
    wispToml.merge(effects, {
      auth: {
        required: input.auth_required,
        to_write: input.auth_to_write,
      },
      security: {
        ip_whitelist: input.ip_whitelist.length
          ? input.ip_whitelist.join(',')
          : undefined,
        ip_blacklist: input.ip_blacklist.length
          ? input.ip_blacklist.join(',')
          : undefined,
      },
      management: {
        admin_pubkeys: joinPubkeys(input.admin_pubkeys),
      },
    }),
)
