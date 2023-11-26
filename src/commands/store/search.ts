import {select} from '@inquirer/prompts'
import {Command, Flags, ux} from '@oclif/core'
import {NearbyStores} from 'dominos'

import {ConfigAPI} from '../../lib/config.js'

export default class Search extends Command {
  static description = 'describe the command here'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    zip: Flags.string({char: 'z', description: 'zip code to search for'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Search)

    const configAPI = new ConfigAPI(this.config.configDir)
    let nearbyStores: NearbyStores

    if (flags.zip) {
      ux.action.start('Searching nearby stores in zip code: ' + flags.zip)
      nearbyStores = await new NearbyStores(flags.zip)
    } else {
      const profile = configAPI.getProfile()
      if (profile?.zip) {
        ux.action.start('Searching nearby stores in your zip code: ' + profile.zip)
        nearbyStores = await new NearbyStores(profile.zip)
      } else {
        return this.log('You either need to first set up your profile or specify a zip code')
      }
    }

    ux.action.stop()

    const favoriteStoreId = await select({
      message: 'Which store would you like to favorite?',
      choices: nearbyStores.stores.map((store) => ({
        name: store.AddressDescription,
        value: store.StoreID,
      })),
    })

    ux.action.start('Saving your favorite store...')
    configAPI.updateFavoriteStore(favoriteStoreId.toString())
    ux.action.stop()
  }
}
