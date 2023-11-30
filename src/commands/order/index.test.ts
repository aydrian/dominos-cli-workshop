/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import {AmountsBreakdown, Customer, Order as DominosOrder, Item, Payment} from 'dominos'
import prompts from 'prompts'
import {afterEach, describe, expect, it, vi} from 'vitest'

import Order from './index.js'

describe('Order', () => {
  const log = vi.spyOn(Order.prototype, 'log').mockImplementation(() => {})

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('getItemFromPrompt should return an item with the selected options', async () => {
    const testItem = new Item({
      code: '10SCREEN',
      qty: 1,
      options: {
        X: {'1/1': '1'},
        C: {'1/1': '1'},
      },
    })

    prompts.inject(['HANDTOSS', '10SCREEN', 'X', ['C']])
    const item = await Order.prototype.getItemFromPrompt()

    expect(item).toBeInstanceOf(Item)
    // Workaround for auto-generated iD
    testItem.iD = item.iD
    expect(item).toEqual(testItem)
  })

  it('getOrderFromPrompt should return an order with the user input', async () => {
    const testStoreID = '12345'
    const testCustomer = new Customer({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com',
      phone: '123-456-7890',
      address: '123 Main St',
    })
    const testItem = new Item({
      code: '10SCREEN',
      qty: 1,
      options: {
        X: {'1/1': '1'},
        C: {'1/1': '1'},
      },
    })
    const testOrder = new DominosOrder(testCustomer)
    testOrder.storeID = testStoreID
    testOrder.addItem(testItem)
    testOrder.addItem(testItem)

    const getItemFromPrompt = vi.spyOn(Order.prototype, 'getItemFromPrompt').mockResolvedValue(testItem)
    prompts.inject([true, false])

    const order = await Order.prototype.getOrderFromPrompt(testCustomer, '12345')
    expect(getItemFromPrompt).toBeCalledTimes(2)
    expect(order).toBeInstanceOf(DominosOrder)
    expect(order).toEqual(testOrder)
  })

  it('getPaymentFromPrompt should return a payment with the user input', async () => {
    const amountToCharge = 10
    const tipAmount = 0
    const number = '1234567890123456'
    const expiration = '01/2023'
    const securityCode = '123'
    const postalCode = '12345'
    const getTipFromPrompt = vi.spyOn(Order.prototype, 'getTipFromPrompt').mockResolvedValue(tipAmount)

    prompts.inject([number, expiration, securityCode, postalCode])

    const payment = await Order.prototype.getPaymentFromPrompt(amountToCharge)

    expect(getTipFromPrompt).toBeCalled()
    expect(payment).toBeInstanceOf(Payment)
    expect(payment).toEqual(
      new Payment({number, expiration, securityCode, postalCode, amount: amountToCharge, tipAmount}),
    )
    getTipFromPrompt.mockRestore()
  })

  it('getTipFromPrompt should return the tip amount', async () => {
    const total = 10
    const tip = 0.15
    const tipAmount = Math.round((total * tip + Number.EPSILON) * 100) / 100

    prompts.inject([true, tipAmount.toString()])
    const result = await Order.prototype.getTipFromPrompt(total)

    expect(result).toEqual(tipAmount)
  })

  it('printPrice should format the price and print it', async () => {
    const amountsBreakdown: AmountsBreakdown = {
      customer: 12.34,
      tax: 0.56,
      foodAndBeverage: '0',
      adjustment: '0',
      surcharge: '0',
      deliveryFee: '0',
      tax1: 0,
      tax2: 0,
      tax3: 0,
      tax4: 0,
      tax5: 0,
      bottle: 0,
      cash: 0,
      roundingAdjustment: 0,
      savings: '0',
    }

    Order.prototype.printPrice(amountsBreakdown)

    expect(log).toHaveBeenCalled()
  })
})
