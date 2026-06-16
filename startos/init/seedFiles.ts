import { sdk } from '../sdk'
import { wispToml } from '../fileModels/wisp.toml'

// Seed wisp.toml on every init to ensure trust_proxy is configured on install
// and reapplied on upgrade. The merge below only sets security.trust_proxy;
// the host/port/storage defaults come from the schema's .catch() fallbacks in
// fileModels/wisp.toml.ts, applied when the file is read and validated.
//
// trust_proxy must be true: every client reaches Wisp through the StartOS
// reverse proxy, which collapses all of them to the proxy's single source IP.
// Without it, the relay's real client IP is lost and max_connections_per_ip
// caps the whole relay at one bucket. The StartOS ws/wss proxy injects
// X-Forwarded-For, so Wisp can recover the real client IP. trusted_proxies is
// left empty on purpose: with trust_proxy=true that honors X-Forwarded-For from
// any peer, which is safe here because the relay port is only reachable through
// the proxy. (Setting a wrong proxy address would silently disable the fix.)
export const seedFiles = sdk.setupOnInit(async (effects) => {
  await wispToml.merge(effects, {
    security: { trust_proxy: true },
  })
})
