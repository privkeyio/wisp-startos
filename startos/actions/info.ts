import { wispToml } from '../fileModels/wisp.toml'
import { sdk } from '../sdk'
import { i18n } from '../i18n'
import { npubOrHexPattern, pubkeyToHex, relayInterfaceId } from '../utils'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  relay_url: getExternalAddresses(),
  name: Value.text({
    name: i18n('Name'),
    description: i18n("Your relay's human-readable name (NIP-11)"),
    required: false,
    default: null,
    placeholder: 'My Wisp Relay',
    maxLength: 64,
  }),
  description: Value.text({
    name: i18n('Description'),
    description: i18n('A detailed description for your relay (NIP-11)'),
    required: false,
    default: null,
    placeholder: 'A lightweight Nostr relay',
    maxLength: 256,
  }),
  pubkey: Value.text({
    name: i18n('Admin Pubkey'),
    description: i18n(
      'The Nostr public key of the relay administrator (NIP-11). Accepts an npub or a 64-character hex key.',
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
  contact: Value.text({
    name: i18n('Admin Contact'),
    description: i18n('Contact URI of the relay administrator (NIP-11)'),
    required: false,
    default: null,
    placeholder: 'mailto:admin@example.com',
    maxLength: 256,
  }),
})

export const configureInfo = sdk.Action.withInput(
  'configure-info',

  async ({ effects }) => ({
    name: i18n('Relay Information'),
    description: i18n('Set the public metadata your relay advertises (NIP-11)'),
    warning: i18n('Changes take effect the next time the relay starts.'),
    allowedStatuses: 'any',
    group: 'configure',
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const data = await wispToml.read().once()
    return {
      ...(data?.relay ?? {}),
      relay_url: data?.auth?.relay_url ?? undefined,
    }
  },

  async ({ effects, input }) =>
    wispToml.merge(effects, {
      relay: {
        name: input.name ?? undefined,
        description: input.description ?? undefined,
        pubkey: input.pubkey ? pubkeyToHex(input.pubkey) : undefined,
        contact: input.contact ?? undefined,
      },
      auth: { relay_url: input.relay_url || undefined },
    }),
)

export function getExternalAddresses() {
  return sdk.Value.dynamicSelect(async ({ effects }) => {
    const urls = await sdk.serviceInterface
      .getOwn(
        effects,
        relayInterfaceId,
        (iface) => iface?.addressInfo?.public.format() || [],
      )
      .const()

    return {
      name: i18n('Relay URL'),
      description: i18n(
        'The public address your relay advertises for NIP-42 authentication. Select None to leave it unset.',
      ),
      values: urls.reduce((obj, url) => ({ ...obj, [url]: url }), {
        '': i18n('None'),
      } as Record<string, string>),
      default: '',
    }
  })
}
