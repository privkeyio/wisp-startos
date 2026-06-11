import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'wisp',
  title: 'Wisp',
  license: 'MIT',
  donationUrl: null,
  packageRepo: 'https://github.com/privkeyio/wisp-startos',
  upstreamRepo: 'https://github.com/privkeyio/wisp',
  marketingUrl: 'https://github.com/privkeyio/wisp',
  description: { short, long },
  volumes: ['main', 'config'],
  images: {
    wisp: {
      source: { dockerBuild: { dockerfile: 'Dockerfile' } },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {},
})
