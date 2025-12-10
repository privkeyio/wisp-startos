import { sdk } from './sdk'
import { wsPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const wsMulti = sdk.MultiHost.of(effects, 'ws-multi')
  const wsMultiOrigin = await wsMulti.bindPort(wsPort, {
    protocol: 'http',
  })
  const websocket = sdk.createInterface(effects, {
    name: 'WebSocket Interface',
    id: 'websocket',
    description: 'Nostr WebSocket relay interface',
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const wsReceipt = await wsMultiOrigin.export([websocket])

  return [wsReceipt]
})
