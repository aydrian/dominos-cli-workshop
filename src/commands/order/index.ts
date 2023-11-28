/* eslint-disable no-await-in-loop */
import {checkbox, confirm, input, select} from '@inquirer/prompts'
import {Command, ux} from '@oclif/core'
import {AmountsBreakdown, Order as DominosOrder, Item, Payment} from 'dominos'

import {ConfigAPI} from '../../lib/config.js'
import {crusts, sauces, toppings} from '../../lib/pizza.js'

export default class Order extends Command {
  static description = 'describe the command here'

  static examples = ['<%= config.bin %> <%= command.id %>']

  printPrice(amountsBreakdown: AmountsBreakdown) {
    const {customer} = amountsBreakdown
    return `Your order will cost ${customer.toFixed(2)} dollars`
  }

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

    ux.action.start('Validating your order...')
    await order.validate()
    await order.price()

    this.log(this.printPrice(order.amountsBreakdown))
    ux.action.stop()

    // console.dir(order.amountsBreakdown)
    this.log('How would you like to pay?')

    const paymentInput = {
      number: await input({message: 'What is your card number?'}),
      expiration: await input({message: 'What is your card expiration?'}),
      securityCode: await input({message: 'What is your card security code?'}),
      postalCode: await input({message: 'What is your card postal code?'}),
    }

    const payment = new Payment({...paymentInput, amount: order.amountsBreakdown.customer})

    const addTip = await confirm({message: 'Would you like to add a tip?', default: true})
    if (addTip) {
      const fifteenPercentTip = order.amountsBreakdown.customer * 0.15
      const eighteenPercentTip = order.amountsBreakdown.customer * 0.18
      const twentyPercentTip = order.amountsBreakdown.customer * 0.2
      let tipAmount = await select({
        message: 'How much would you like to tip?',
        choices: [
          {name: `15% (${fifteenPercentTip})`, value: fifteenPercentTip.toFixed(2)},
          {name: `18% (${eighteenPercentTip})`, value: eighteenPercentTip.toFixed(2)},
          {name: `20% (${twentyPercentTip})`, value: twentyPercentTip.toFixed(2)},
          {name: 'other', value: 'other'},
        ],
      })
      if (tipAmount === 'other') {
        tipAmount = await input({message: 'How much would you like to tip?'})
      }

      payment.tipAmount = Number.parseFloat(tipAmount)
    }

    order.payments.push(payment)

    const ready = await confirm({message: 'Would you like to place your order?', default: false})

    if (ready) {
      ux.action.start('Placing your order...')
      try {
        await order.place()
      } catch (error) {
        console.trace(error)

        // inspect Order Response to see more information about the
        // failure, unless you added a real card, then you can inspect
        // the order itself
        console.log('\n\nFailed Order Probably Bad Card, here is order.priceResponse the raw response from Dominos\n\n')
        console.dir(order.placeResponse, {depth: 5})
      }

      ux.action.stop()

      this.log(`Your order has been placed! Your order number is ${order.orderID}`)
      this.log('Your order has been placed! You may track your order using `dominos track`')
    }
  }
}
