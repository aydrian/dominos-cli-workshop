/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import {AmountsBreakdown, Customer, Order as DominosOrder, Item, Payment, Store} from 'dominos'
import prompts from 'prompts'
import {afterEach, beforeAll, describe, expect, it, vi} from 'vitest'

import {ConfigAPI} from '../../lib/config.js'
import Order from './index.js'

vi.mock('../../lib/config.js')

describe('Order', () => {
  const log = vi.spyOn(Order.prototype, 'log').mockImplementation(() => {})
  const testCustomer = new Customer({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@doe.com',
    phone: '123-456-7890',
    address: '123 Main St',
  })
  let testStore: Store

  beforeAll(async () => {
    testStore = await new Store('4332')
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getItemFromPrompt', () => {
    it('should return an item with the selected options', async () => {
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
  })

  describe('getOrderFromPrompt', () => {
    it('should return an order with the user input', async () => {
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
  })

  describe('getPaymentFromPrompt', () => {
    it('should return a payment with the user input', async () => {
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
  })

  describe('getTipFromPrompt', () => {
    it('should return the tip amount', async () => {
      const total = 10
      const tip = 0.15
      const tipAmount = Math.round((total * tip + Number.EPSILON) * 100) / 100

      prompts.inject([true, tipAmount.toString()])
      const result = await Order.prototype.getTipFromPrompt(total)

      expect(result).toEqual(tipAmount)
    })

    it('should return the tip amount entered as other', async () => {
      const total = 10
      const tip = 0.22
      const tipAmount = Math.round((total * tip + Number.EPSILON) * 100) / 100

      prompts.inject([true, 'other', tipAmount.toString()])
      const result = await Order.prototype.getTipFromPrompt(total)

      expect(result).toEqual(tipAmount)
    })

    it('should return 0  if addTip is entered as no', async () => {
      const total = 10
      prompts.inject([false])
      const result = await Order.prototype.getTipFromPrompt(total)

      expect(result).toEqual(0)
    })
  })

  describe('printPrice', () => {
    it('should format the price and print it', async () => {
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

  it('should create an order from the user input', async () => {
    const testPayment = new Payment({
      number: '123456789012',
      expiration: '01/23',
      securityCode: '123',
      postalCode: '12345',
      amount: 10,
      tipAmount: 0,
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
    testOrder.storeID = testStore.info.StoreID.toString()
    testOrder.addItem(testItem)

    const getCustomer = vi.spyOn(ConfigAPI.prototype, 'getCustomer').mockResolvedValue(testCustomer)
    const getStore = vi.spyOn(ConfigAPI.prototype, 'getFavoriteStore').mockResolvedValue(testStore)
    const getOrderFromPrompt = vi.spyOn(Order.prototype, 'getOrderFromPrompt').mockResolvedValue(testOrder)
    const getPaymentFromPrompt = vi.spyOn(Order.prototype, 'getPaymentFromPrompt').mockResolvedValue(testPayment)
    const validate = vi.spyOn(DominosOrder.prototype, 'validate').mockResolvedValue(testOrder)
    const price = vi.spyOn(DominosOrder.prototype, 'price').mockResolvedValue(testOrder)
    const place = vi.spyOn(DominosOrder.prototype, 'place').mockResolvedValue(testOrder)

    prompts.inject([true])
    await Order.run()

    expect(getCustomer).toBeCalled()
    expect(getStore).toBeCalled()
    expect(getOrderFromPrompt).toBeCalled()
    expect(getPaymentFromPrompt).toBeCalled()
    expect(validate).toBeCalled()
    expect(price).toBeCalled()
    expect(place).toBeCalled()
  })

  it('should not place an order if the user cancels', async () => {
    const testPayment = new Payment({
      number: '123456789012',
      expiration: '01/23',
      securityCode: '123',
      postalCode: '12345',
      amount: 10,
      tipAmount: 0,
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
    testOrder.storeID = testStore.info.StoreID.toString()
    testOrder.addItem(testItem)

    vi.spyOn(ConfigAPI.prototype, 'getCustomer').mockResolvedValue(testCustomer)
    vi.spyOn(ConfigAPI.prototype, 'getFavoriteStore').mockResolvedValue(testStore)
    vi.spyOn(Order.prototype, 'getOrderFromPrompt').mockResolvedValue(testOrder)
    vi.spyOn(Order.prototype, 'getPaymentFromPrompt').mockResolvedValue(testPayment)
    vi.spyOn(DominosOrder.prototype, 'validate').mockResolvedValue(testOrder)
    vi.spyOn(DominosOrder.prototype, 'price').mockResolvedValue(testOrder)
    const place = vi.spyOn(DominosOrder.prototype, 'place').mockResolvedValue(testOrder)

    prompts.inject([false])
    await Order.run()

    expect(place).not.toBeCalled()
  })

  it('should handle an error while placing an order gracefully', async () => {
    const testStore = await new Store('4332')
    const testPayment = new Payment({
      number: '123456789012',
      expiration: '01/23',
      securityCode: '123',
      postalCode: '12345',
      amount: 10,
      tipAmount: 0,
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
    testOrder.storeID = testStore.info.StoreID.toString()
    testOrder.addItem(testItem)

    vi.spyOn(ConfigAPI.prototype, 'getCustomer').mockResolvedValue(testCustomer)
    vi.spyOn(ConfigAPI.prototype, 'getFavoriteStore').mockResolvedValue(testStore)
    vi.spyOn(Order.prototype, 'getOrderFromPrompt').mockResolvedValue(testOrder)
    vi.spyOn(Order.prototype, 'getPaymentFromPrompt').mockResolvedValue(testPayment)
    vi.spyOn(DominosOrder.prototype, 'validate').mockResolvedValue(testOrder)
    vi.spyOn(DominosOrder.prototype, 'price').mockResolvedValue(testOrder)
    vi.spyOn(DominosOrder.prototype, 'place').mockRejectedValue(new Error('Order error'))

    prompts.inject([true])

    expect(() => Order.run().then((result) => result)).rejects.toThrowError('Failed to place order, please try again')
  })

  it('should prompt the user to set up a profile if one does not exist and exit', async () => {
    const getCustomer = vi.spyOn(ConfigAPI.prototype, 'getCustomer')
    const place = vi.spyOn(DominosOrder.prototype, 'place')

    await Order.run()

    expect(getCustomer).toBeCalled()
    expect(place).not.toBeCalled()
  })

  it('should prompt the user to set up a favorite store if one does not exist and exit', async () => {
    const getCustomer = vi.spyOn(ConfigAPI.prototype, 'getCustomer').mockResolvedValue(testCustomer)
    const getStore = vi.spyOn(ConfigAPI.prototype, 'getFavoriteStore')
    const place = vi.spyOn(DominosOrder.prototype, 'place')

    await Order.run()

    expect(getCustomer).toBeCalled()
    expect(getStore).toBeCalled()
    expect(place).not.toBeCalled()
  })
})
