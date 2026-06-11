import { i18n } from './i18n'
import { sdk } from './sdk'
import { relayInterfaceId, relayPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const wsMulti = sdk.MultiHost.of(effects, 'websocket')
  const wsOrigin = await wsMulti.bindPort(relayPort, {
    protocol: 'ws',
  })
  const ws = sdk.createInterface(effects, {
    name: i18n('Relay Websocket'),
    id: relayInterfaceId,
    description: i18n(
      'Nostr clients connect to your relay through this interface',
    ),
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const wsReceipt = await wsOrigin.export([ws])

  return [wsReceipt]
})
