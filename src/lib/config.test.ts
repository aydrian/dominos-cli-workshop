import {Address, Customer} from 'dominos'
import * as fs from 'node:fs'
import {afterEach, describe, expect, it, vi} from 'vitest'

import {ConfigAPI, type Profile} from './config.js'

vi.mock('fs', async (importOriginal) => {
  const mod = await importOriginal<typeof import('node:fs')>()
  return {
    ...mod,
    writeFileSync: vi.fn(),
  }
})
vi.mock('dominos', async (importOriginal) => {
  const mod = await importOriginal<typeof import('dominos')>()
  return {
    ...mod,
  }
})

describe('Config API', () => {
  let configAPI: ConfigAPI
  const readConfig = vi.spyOn(ConfigAPI.prototype, 'readConfig')

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('getCustomer() should return null if no customer profile is set', () => {
    readConfig.mockImplementation(() => ({}))
    configAPI = new ConfigAPI('test')
    expect(configAPI.getCustomer()).toBeNull()
  })

  it('getCustomer() should return a customer with the correct details', () => {
    const profile: Profile = {
      address1: '123 Main St',
      address2: 'Apt 2B',
      city: 'Anytown',
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '555-555-5555',
      state: 'CA',
      zip: '12345',
    }

    readConfig.mockImplementation(() => ({profile}))
    const configAPI = new ConfigAPI('test')
    const customer = configAPI.getCustomer()
    expect(customer).toBeInstanceOf(Customer)
    expect(customer?.firstName).toEqual(profile.firstName)
    expect(customer?.lastName).toEqual(profile.lastName)
    expect(customer?.email).toEqual(profile.email)
    expect(customer?.phone).toEqual(profile.phone.replaceAll('-', ''))

    const address = new Address({
      street: `${profile.address1}${profile.address2 ? ` ${profile.address2}` : ''}`,
      city: profile.city,
      region: profile.state,
      postalCode: profile.zip,
    })

    expect(customer?.address).toEqual(address)
  })

  it('getFavoriteStore() should return null if no favorite store is set', async () => {
    readConfig.mockImplementation(() => ({}))
    configAPI = new ConfigAPI('/path/to/config')
    const favoriteStore = await configAPI.getFavoriteStore()
    expect(favoriteStore).toBeNull()
  })

  it('getFavoriteStore() should return the favorite store if it is set', async () => {
    const storeId = '4332'
    readConfig.mockImplementation(() => ({favoriteStoreId: storeId}))
    configAPI = new ConfigAPI('test')
    const favoriteStore = await configAPI.getFavoriteStore()

    expect(favoriteStore?.info.StoreID?.toString()).toEqual(storeId)
  })

  it('writeConfig() should write the config to a file', async () => {
    readConfig.mockImplementation(() => ({}))
    const configAPI = new ConfigAPI('test')
    configAPI.writeConfig()
    expect(vi.mocked(fs.writeFileSync)).toHaveBeenLastCalledWith('test', '{}', {encoding: 'utf8'})
  })
})
