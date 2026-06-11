import { i18n } from './i18n'
import { sdk } from './sdk'
import { configPath, relayPort, storageMountpoint } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info('Starting Wisp!')

  const mounts = sdk.Mounts.of()
    .mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: storageMountpoint,
      readonly: false,
    })
    .mountVolume({
      volumeId: 'config',
      subpath: 'wisp.toml',
      mountpoint: configPath,
      type: 'file',
      readonly: true,
    })

  const subcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'wisp' },
    mounts,
    'wisp-relay',
  )

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer,
    exec: { command: ['wisp', 'relay', configPath] },
    ready: {
      display: i18n('Relay'),
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, relayPort, {
          successMessage: i18n('The relay is ready and accepting connections'),
          errorMessage: i18n('The relay is not responding'),
        }),
    },
    requires: [],
  })
})
