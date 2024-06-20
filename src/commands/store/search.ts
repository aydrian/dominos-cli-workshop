import {Command, Flags} from '@oclif/core'
import {NearbyStores} from 'dominos'
import ora from 'ora'
// eslint-disable-next-line import/no-named-as-default
import prompts from 'prompts'

import {ConfigAPI} from '../../lib/config.js'

export default class Search extends Command {
  static description = 'describe the command here'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    zip: Flags.string({char: 'z', description: 'zip code to search for'}),
  }

  public async getFavoriteStoreFromPrompt(nearbyStores: NearbyStores): Promise<string> {
    const storeChoices = nearbyStores.stores.map((store) => ({
      title: store.AddressDescription,
      value: store.StoreID,
    }))

    const response = await prompts({
      type: 'select',
      name: 'store',
      message: 'Which store would you like to favorite?',
      choices: storeChoices,
    })

    return response.store
  }

  public async run(): Promise<void> {
    const spinner = ora()
    const {flags} = await this.parse(Search)

    const configAPI = new ConfigAPI()
    let nearbyStores: NearbyStores

    if (flags.zip) {
      spinner.start('Searching nearby stores in zip code: ' + flags.zip)
      nearbyStores = await new NearbyStores(flags.zip)
    } else {
      const profile = configAPI.getProfile()
      if (profile?.zip) {
        spinner.start('Searching nearby stores in your zip code: ' + profile.zip)
        nearbyStores = await new NearbyStores(profile.zip)
      } else {
        return this.log('You either need to first set up your profile or specify a zip code')
      }
    }

    spinner.stop()

    const favoriteStoreId = await this.getFavoriteStoreFromPrompt(nearbyStores)

    spinner.start('Saving your favorite store...')
    configAPI.updateFavoriteStore(favoriteStoreId.toString())
    spinner.stop()
  }
}
