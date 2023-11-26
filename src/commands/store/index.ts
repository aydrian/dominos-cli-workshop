import {Command} from '@oclif/core'

import {ConfigAPI} from '../../lib/config.js'

export default class Store extends Command {
  static description = 'Display favorite store'

  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const configAPI = new ConfigAPI(this.config.configDir)
    const favoriteStore = await configAPI.getFavoriteStore()

    if (!favoriteStore) {
      return this.log('You have not set up a favorite store yet.')
    }

    this.log(`Your favorite store is Store #${favoriteStore.info.StoreID}`)
    this.log(`${favoriteStore.info.StreetName}
${favoriteStore.info.City}, ${favoriteStore.info.Region} ${favoriteStore.info.PostalCode}
Phone: ${favoriteStore.info.Phone}`)
  }
}
