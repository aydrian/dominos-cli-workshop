import {Command, Flags} from '@oclif/core'
import {ITrackingResult, Tracking} from 'dominos'
import ora from 'ora'

import {ConfigAPI} from '../../lib/config.js'

export default class Track extends Command {
  static description = 'Track an existing order'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    phone: Flags.string({char: 'p', description: 'phone number attached to order to track'}),
  }

  public async run(): Promise<void> {
    const spinner = ora()
    const {flags} = await this.parse(Track)
    const tracking = new Tracking()
    let trackingResult: ITrackingResult

    if (flags.phone) {
      spinner.start('Tracking order with phone number: ' + flags.phone)
      trackingResult = await tracking.byPhone(flags.phone)
    } else {
      const configAPI = new ConfigAPI()
      const profile = configAPI.getProfile()
      if (profile?.phone) {
        spinner.start('Tracking order with profile phone number: ' + profile.phone)
        trackingResult = await tracking.byPhone(profile.phone)
      } else {
        return this.log('You either need to first set up your profile or specify a phone number')
      }
    }

    spinner.stop()

    this.log(`Your order number is ${trackingResult.orderID}
    ${trackingResult.orderDescription}
    Status: ${trackingResult.orderStatus}`)
  }
}
