/* eslint-disable no-await-in-loop */
import {Command, ux} from '@oclif/core'
import {AmountsBreakdown, Customer, Order as DominosOrder, Item, Payment} from 'dominos'
// eslint-disable-next-line import/no-named-as-default
import prompts from 'prompts'

import {ConfigAPI} from '../../lib/config.js'

export default class Order extends Command {
  static description = 'describe the command here'

  static examples = ['<%= config.bin %> <%= command.id %>']

  public async getItemFromPrompt(): Promise<Item> {
    const style = await prompts({
      type: 'select',
      name: 'value',
      message: 'What style of pizza would you like?',
      choices: Object.entries(crusts).map(([key, value]) => ({
        value: key,
        title: value.name,
      })),
    })

    const {code, sauce, extraToppings} = await prompts([
      {
        type: 'select',
        name: 'code',
        message: 'What size of pizza would you like?',
        choices: Object.entries(crusts[style.value].sizes).map(([_key, value]) => ({
          value: value.code,
          title: value.name,
        })),
      },
      {
        type: 'select',
        name: 'sauce',
        message: 'What sauce would you like?',
        choices: sauces.map((sauce) => ({
          value: sauce.code,
          title: sauce.name,
        })),
      },
      {
        type: 'multiselect',
        name: 'extraToppings',
        message: 'What toppings would you like?',
        choices: toppings.map((topping) => ({
          value: topping.code,
          title: topping.name,
        })),
      },
    ])

    const item = new Item({
      code,
      qty: 1,
      options: {
        [sauce]: {'1/1': '1'},
        ...extraToppings.reduce((acc: Record<string, Record<string, string>>, topping: string) => {
          acc[topping] = {'1/1': '1'}
          return acc
        }, {}),
      },
    })
    return item
  }

  public async getOrderFromPrompt(customer: Customer, storeID: string): Promise<DominosOrder> {
    const order = new DominosOrder(customer)
    order.storeID = storeID

    let addingItems = true

    while (addingItems) {
      const item = await this.getItemFromPrompt()

      order.addItem(item)

      const response = await prompts({
        type: 'confirm',
        name: 'value',
        message: 'Would you like to add another item?',
      })
      addingItems = response.value
    }

    return order
  }

  public async getPaymentFromPrompt(amountToCharge: number): Promise<Payment> {
    this.log('How would you like to pay?')

    const paymentInput = await prompts([
      {type: 'text', name: 'number', message: 'What is your card number?'},
      {
        type: 'text',
        name: 'expiration',
        message: 'What is your card expiration? (MM/YYYY)',
        validate(value) {
          const parts = value.split('/')
          if (parts.length !== 2) {
            return false
          }

          const month = Number.parseInt(parts[0], 10)
          const year = Number.parseInt(parts[1], 10)
          const isValid = month > 0 && month < 13 && year >= 2023 && year <= new Date().getFullYear() + 10
          return isValid ? true : 'Invalid expiration date'
        },
      },
      {
        type: 'text',
        name: 'securityCode',
        message: 'What is your card security code?',
        validate: (value) =>
          (value.length === 3 || value.length === 4) && /^\d{3,4}$/.test(value)
            ? true
            : 'Security code must be 3 or 4 digits',
      },
      {type: 'text', name: 'postalCode', message: 'What is your card postal code?'},
    ])

    const payment = new Payment({...paymentInput, amount: amountToCharge})

    // prompt for tip amount
    payment.tipAmount = await this.getTipFromPrompt(amountToCharge)

    return payment
  }

  public async getTipFromPrompt(total: number): Promise<number> {
    const currency = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'})

    const tipChoices = [0.15, 0.18, 0.2].map((tip) => {
      const tipAmount = Math.round((total * tip + Number.EPSILON) * 100) / 100
      return {
        title: `${tip * 100}% ${currency.format(tipAmount)}`,
        value: tipAmount.toString(),
      }
    })

    const response = await prompts([
      {
        type: 'confirm',
        name: 'addTip',
        message: 'Would you like to add a tip?',
        initial: true,
      },
      {
        type: (prev) => (prev ? 'select' : null),
        name: 'tipAmount',
        message: 'How much would you like to tip?',
        choices: [...tipChoices, {title: 'Other', value: 'other'}],
      },
      {
        type: (prev) => (prev === 'other' ? 'number' : null),
        name: 'tipAmount',
        message: 'How much would you like to tip?',
        initial: 0,
      },
    ])
    console.log({response})

    return Number.parseFloat(response.tipAmount ?? 0)
  }

  public printPrice(amountsBreakdown: AmountsBreakdown) {
    const {customer} = amountsBreakdown
    const currency = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'})
    this.log(`Your order will cost ${currency.format(customer)}`)
  }

  public async run(): Promise<void> {
    const configAPI = new ConfigAPI(this.config.configDir)

    // Get the customer from the config file
    const customer = configAPI.getCustomer()
    if (!customer) {
      this.log('You need to set up your profile first!')
      this.log('Run `dominos profile` to get started!')
      return
    }

    this.log("Let's order a pizza!")

    ux.action.start('Retreiving your favorite store...')

    // Get the favorite store from the config file
    const favoriteStore = await configAPI.getFavoriteStore()
    if (!favoriteStore) {
      this.log('You need to set up your favorite store first!')
      this.log('Run `dominos store search` to get started!')
      return
    }

    ux.action.stop()

    // Get order by prompting for items
    const order = await this.getOrderFromPrompt(customer, favoriteStore.info.StoreID.toString())

    ux.action.start('Validating your order...')
    await order.validate()

    await order.price()
    this.printPrice(order.amountsBreakdown)
    ux.action.stop()

    // Get payment by prompting for credit card info
    const payment = await this.getPaymentFromPrompt(order.amountsBreakdown.customer)
    order.payments.push(payment)

    const response = await prompts({
      type: 'confirm',
      name: 'ready',
      message: 'Would you like to place your order?',
    })

    if (response.ready) {
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
      this.log('You may track your order using `dominos track`')
    } else {
      this.log('Order cancelled!')
    }
  }
}

interface Crusts {
  [key: string]: {
    name: string
    sizes: {
      [key: string]: {code: string; name: string}
    }
  }
}

export const crusts: Crusts = {
  HANDTOSS: {
    name: 'Hand Tossed ',
    sizes: {
      sm: {
        name: 'Small 10"',
        code: '10SCREEN',
      },
      md: {
        name: 'Medium 12"',
        code: '12SCREEN',
      },
      lg: {
        name: 'Large 14"',
        code: '14SCREEN',
      },
    },
  },
  NPAN: {
    name: 'Handmade Pan',
    sizes: {
      md: {
        name: 'Medium 12"',
        code: 'P12IPAZA',
      },
    },
  },
  THIN: {
    name: 'Crunchy Thin Crust',
    sizes: {
      md: {
        name: 'Medium 12"',
        code: '12THIN',
      },
      lg: {
        name: 'Large 14"',
        code: '14THIN',
      },
    },
  },
  BK: {
    name: 'Brooklyn Style',
    sizes: {
      lg: {
        name: 'Large 14"',
        code: 'PBKIREZA',
      },
      xl: {
        name: 'X-Large 16"',
        code: 'P16IBKZA',
      },
    },
  },
  GLUTENF: {
    name: 'Gluten Free',
    sizes: {
      sm: {
        name: 'Small 10"',
        code: 'P10IGFZA',
      },
    },
  },
}

export const sauces = [
  {
    code: 'X',
    name: 'Robust Inspired Tomato Sauce',
  },
  {
    code: 'Xm',

    name: 'Hearty Marinara Sauce',
  },
  {
    code: 'Bq',

    name: 'Honey BBQ Sauce',
  },
  {
    code: 'Xw',

    name: 'Garlic Parmesan Sauce',
  },
]

export const toppings = [
  {
    availability: [],
    code: 'C',
    description: '',
    local: false,
    name: 'Cheese',
    tags: {
      cheese: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'H',
    description: '',
    local: false,
    name: 'Ham',
    tags: {
      meat: true,
    },
  },
  {
    availability: [],
    code: 'B',
    description: '',
    local: false,
    name: 'Beef',
    tags: {
      meat: true,
    },
  },
  {
    availability: [],
    code: 'Sa',
    description: '',
    local: false,
    name: 'Salami',
    tags: {
      meat: true,
    },
  },
  {
    availability: [],
    code: 'P',
    description: '',
    local: false,
    name: 'Pepperoni',
    tags: {
      meat: true,
    },
  },
  {
    availability: [],
    code: 'S',
    description: '',
    local: false,
    name: 'Italian Sausage',
    tags: {
      meat: true,
    },
  },
  {
    availability: [],
    code: 'Du',
    description: '',
    local: false,
    name: 'Premium Chicken',
    tags: {
      meat: true,
    },
  },
  {
    availability: [],
    code: 'K',
    description: '',
    local: false,
    name: 'Bacon',
    tags: {
      meat: true,
    },
  },
  {
    availability: [],
    code: 'Pm',
    description: '',
    local: false,
    name: 'Philly Steak',
    tags: {
      meat: true,
    },
  },
  {
    availability: [],
    code: 'Ht',
    description: '',
    local: false,
    name: 'Hot Buffalo Sauce',
    tags: {
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'F',
    description: '',
    local: true,
    name: 'Garlic',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'J',
    description: '',
    local: false,
    name: 'Jalapeno Peppers',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'O',
    description: '',
    local: false,
    name: 'Onions',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Z',
    description: '',
    local: false,
    name: 'Banana Peppers',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Td',
    description: '',
    local: false,
    name: 'Diced Tomatoes',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'R',
    description: '',
    local: false,
    name: 'Black Olives',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'M',
    description: '',
    local: false,
    name: 'Mushrooms',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'N',
    description: '',
    local: false,
    name: 'Pineapple',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Cp',
    description: '',
    local: false,
    name: 'Shredded Provolone Cheese',
    tags: {
      nonMeat: true,
      baseOptionQty: '1',
    },
  },
  {
    availability: [],
    code: 'E',
    description: '',
    local: false,
    name: 'Cheddar Cheese',
    tags: {
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'G',
    description: '',
    local: false,
    name: 'Green Peppers',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Si',
    description: '',
    local: false,
    name: 'Spinach',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Rr',
    description: '',
    local: false,
    name: 'Roasted Red Peppers',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Fe',
    description: '',
    local: false,
    name: 'Feta Cheese',
    tags: {
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Cs',
    description: '',
    local: false,
    name: 'Shredded Parmesan Asiago',
    tags: {
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Ac',
    description: '',
    local: false,
    name: 'American Cheese',
    tags: {
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Xf',
    description: '',
    local: false,
    name: 'Alfredo Sauce',
    tags: {
      wholeOnly: true,
      ignoreQty: true,
      exclusiveGroup: 'Sauce',
      sauce: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Rd',
    description: '',
    local: false,
    name: 'Ranch',
    tags: {
      wholeOnly: true,
      ignoreQty: true,
      sauce: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Km',
    description: '',
    local: false,
    name: 'Ketchup-mustard sauce',
    tags: {
      wholeOnly: true,
      ignoreQty: true,
      exclusiveGroup: 'Sauce',
      sauce: true,
      nonMeat: true,
    },
  },
]
