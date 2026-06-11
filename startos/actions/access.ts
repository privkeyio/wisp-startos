import { wispToml } from '../fileModels/wisp.toml'
import { sdk } from '../sdk'
import { i18n } from '../i18n'
import { pubkeyToHex } from '../utils'

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
            regex: '^(npub1[02-9ac-hj-np-z]{6,}|[0-9a-fA-F]{64})$',
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
      { placeholder: '192.168.1' },
    ),
  ),
  ip_blacklist: Value.list(
    List.text(
      {
        name: i18n('IP Blocklist'),
        description: i18n('IP address prefixes that are always rejected.'),
      },
      { placeholder: '10.0.0' },
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
      admin_pubkeys: data?.management?.admin_pubkeys
        ? data.management.admin_pubkeys.split(',').filter(Boolean)
        : [],
      ip_whitelist: data?.security?.ip_whitelist
        ? data.security.ip_whitelist.split(',').filter(Boolean)
        : [],
      ip_blacklist: data?.security?.ip_blacklist
        ? data.security.ip_blacklist.split(',').filter(Boolean)
        : [],
    }
  },

  async ({ effects, input }) =>
    wispToml.merge(effects, {
      auth: {
        required: input.auth_required,
        to_write: input.auth_to_write,
      },
      security: {
        ip_whitelist: input.ip_whitelist.join(','),
        ip_blacklist: input.ip_blacklist.join(','),
      },
      management: {
        admin_pubkeys: input.admin_pubkeys.length
          ? input.admin_pubkeys.map(pubkeyToHex).join(',')
          : undefined,
      },
    }),
)
