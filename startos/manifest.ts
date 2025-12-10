import { setupManifest } from '@start9labs/start-sdk'
import { SDKImageInputSpec } from '@start9labs/start-sdk/base/lib/types/ManifestTypes'

const BUILD = process.env.BUILD || ''

const architectures =
  BUILD === 'x86_64' || BUILD === 'aarch64' ? [BUILD] : ['x86_64', 'aarch64']

export const manifest = setupManifest({
  id: 'wisp',
  title: 'Wisp',
  license: 'MIT',
  wrapperRepo: 'https://github.com/privkeyio/wisp-startos',
  upstreamRepo: 'https://github.com/privkeyio/wisp',
  supportSite: 'https://github.com/privkeyio/wisp/issues',
  marketingSite: 'https://github.com/privkeyio/wisp',
  donationUrl: null,
  docsUrl:
    'https://github.com/privkeyio/wisp-startos/blob/master/docs/instructions.md',
  description: {
    short: 'A lightweight Nostr relay written in Zig',
    long: 'Wisp is a high-performance Nostr relay written in Zig. It uses LMDB for storage and supports the full Nostr relay protocol including NIP-11 relay information.',
  },
  volumes: ['main'],
  images: {
    wisp: {
      source: { dockerTag: 'start9/wisp' },
      arch: architectures,
    } as SDKImageInputSpec,
  },
  hardwareRequirements: {
    arch: architectures,
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
})
