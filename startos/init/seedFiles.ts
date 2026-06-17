import { sdk } from '../sdk'
import { wispToml } from '../fileModels/wisp.toml'

// Seed wisp.toml on every init so schema defaults (fixed host/port/storage) are
// written on install and applied on upgrade.
//
// Behind the StartOS reverse proxy every client shares the proxy's source IP, so
// wisp's per-IP connection limit (default 10) would cap the entire relay at 10
// connections internet-wide. Like nostr-rs-relay and strfry on StartOS, this
// package does not limit by IP: global max_connections plus the event and query
// rate limits provide abuse protection. We seed a high per-IP value only when the
// operator has not set one, so the Limits action still wins on later runs. (0 is
// not "unlimited" in wisp, it rejects every connection, so we use a large number.)
export const seedFiles = sdk.setupOnInit(async (effects) => {
  const current = await wispToml.read().once()
  const seedPerIp = current?.security?.max_connections_per_ip === undefined
  await wispToml.merge(
    effects,
    seedPerIp ? { security: { max_connections_per_ip: 100000 } } : {},
  )
})
