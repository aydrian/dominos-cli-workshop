import {Command, Flags, ux} from '@oclif/core'
import {ITrackingResult, Tracking} from 'dominos'

import {ConfigAPI} from '../../lib/config.js'

export default class TrackIndex extends Command {
  static description = 'describe the command here'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    phone: Flags.string({char: 'p', description: 'phone number attached to order to track'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(TrackIndex)
    const tracking = new Tracking()
    let trackingResult: ITrackingResult

    if (flags.phone) {
      ux.action.start('Tracking order with phone number: ' + flags.phone)
      trackingResult = await tracking.byPhone(flags.phone)
    } else {
      const configAPI = new ConfigAPI(this.config.configDir)
      const profile = configAPI.getProfile()
      if (profile?.phone) {
        ux.action.start('Tracking order with profile phone number: ' + profile.phone)
        trackingResult = await tracking.byPhone(profile.phone)
      } else {
        return this.log('You either need to first set up your profile or specify a phone number')
      }
    }

    ux.action.stop()

    this.log(`Your order number is ${trackingResult.orderID}
    ${trackingResult.orderDescription}
    Status: ${trackingResult.orderStatus}`)

    console.dir(trackingResult)
  }
}
