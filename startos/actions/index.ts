import { sdk } from '../sdk'
import { configureInfo } from './info'
import { configureSpider } from './spider'
import { configureLimits } from './limits'
import { configureAccess } from './access'

export const actions = sdk.Actions.of()
  .addAction(configureInfo)
  .addAction(configureSpider)
  .addAction(configureLimits)
  .addAction(configureAccess)
