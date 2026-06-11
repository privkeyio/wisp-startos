import { sdk } from '../sdk'
import { wispToml } from '../fileModels/wisp.toml'

// Seed wisp.toml on every init so new schema defaults (fixed host/port/storage)
// are written on install and applied on upgrade.
export const seedFiles = sdk.setupOnInit(async (effects) => {
  await wispToml.merge(effects, {})
})
