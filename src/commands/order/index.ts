/* eslint-disable no-await-in-loop */
import {checkbox, confirm, select} from '@inquirer/prompts'
import {Command, ux} from '@oclif/core'
import {Order as DominosOrder, Item} from 'dominos'

import {ConfigAPI} from '../../lib/config.js'
import {crusts, sauces, toppings} from '../../lib/pizza.js'

export default class Order extends Command {
  static description = 'describe the command here'

  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const configAPI = new ConfigAPI(this.config.configDir)

    const customer = configAPI.getCustomer()
    if (!customer) {
      this.log('You need to set up your profile first!')
      this.log('Run `dominos profile` to get started!')
      return
    }

    this.log("Let's order a pizza!")

    ux.action.start('Retreiving your favorite store...')

    const favoriteStore = await configAPI.getFavoriteStore()
    if (!favoriteStore) {
      this.log('You need to set up your favorite store first!')
      this.log('Run `dominos store search` to get started!')
      return
    }

    ux.action.stop()

    const order = new DominosOrder(customer)
    const storeID = favoriteStore.info.StoreID.toString()
    order.storeID = storeID

    let addingItems = true

    while (addingItems) {
      const style = await select({
        message: 'What style of pizza would you like?',
        choices: Object.entries(crusts).map(([key, value]) => ({
          value: key,
          name: value.name,
        })),
      })

      const code = await select({
        message: 'What size of pizza would you like?',
        choices: Object.entries(crusts[style].sizes).map(([_key, value]) => ({
          value: value.code,
          name: value.name,
        })),
      })

      const sauce = await select({
        message: 'Which sauce would you like?',
        choices: sauces.map((sauce) => ({
          value: sauce.code,
          name: sauce.name,
        })),
      })

      const extraToppings = await checkbox({
        message: 'What toppings would you like?',
        choices: toppings.map((topping) => ({
          value: topping.code,
          name: topping.name,
        })),
      })

      const item = new Item({
        code,
        qty: 1,
        options: {
          [sauce]: {'1/1': '1'},
          ...extraToppings.reduce((acc: Record<string, Record<string, string>>, topping) => {
            acc[topping] = {'1/1': '1'}
            return acc
          }, {}),
        },
      })

      order.addItem(item)

      addingItems = await confirm({
        message: 'Would you like to add another item?',
        default: false,
      })
    }

    await order.validate()
    // await order.price()
    // const price = order.amountsBreakdown.customer

    // this.log(`Your order will cost ${price.toFixed(2)} dollars`)

    console.dir(order)

    // eslint-disable-next-line no-warning-comments
    // TODO: prompt for payment and submit order
  }
}
