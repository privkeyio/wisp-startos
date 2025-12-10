import { sdk } from './sdk'
import { wsPort } from './utils'

export const main = sdk.setupMain(async ({ effects, started }) => {
  return sdk.Daemons.of(effects, started).addDaemon('primary', {
    subcontainer: await sdk.SubContainer.of(
      effects,
      { imageId: 'wisp' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/data',
        readonly: false,
      }),
      'wisp-relay',
    ),
    exec: { command: ['docker_entrypoint.sh'] },
    ready: {
      display: 'WebSocket Server',
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, wsPort, {
          successMessage: 'The Nostr relay is ready and accepting connections',
          errorMessage: 'The Nostr relay is not responding',
        }),
    },
    requires: [],
  })
})
