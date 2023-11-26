import {afterEach, beforeEach, describe, expect, it, test, vi} from 'vitest'
import fs from 'node:fs'

import {ConfigAPI, type Profile} from './config.js'

vi.mock('fs')
vi.mock('./config.js')
vi.mock('dominos')

describe('Config API', () => {
  let configAPI: ConfigAPI
  const readConfig = vi.spyOn(ConfigAPI.prototype, 'readConfig')

  beforeEach(() => {
    configAPI = new ConfigAPI('./tmp')
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should return null if no customer profile is set', () => {
    const configAPI = new ConfigAPI('test')
    expect(configAPI.getCustomer()).toBeNull()
  })

  it('should return a customer with the correct details', () => {
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
    const configAPI = new ConfigAPI('test')
    configAPI.updateProfile(profile)
    expect(configAPI.getCustomer()).toEqual(
      expect.objectContaining({
        address: expect.objectContaining({
          street: '123 Main St Apt 2B',
          city: 'Anytown',
          region: 'CA',
          postalCode: '12345',
        }),
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '555-555-5555',
      }),
    )
  })

  it('should return null if no favorite store is set', async () => {
    readConfig.mockReturnValue({})
    expect(configAPI.getFavoriteStore()).toBeNull()
  })

  it('should return the favorite store if it is set', async () => {
    const storeId = 'test-store-id'
    readConfig.mockReturnValue({favoriteStoreId: storeId})
    expect(await configAPI.getFavoriteStore()).toBe(expect.objectContaining({id: storeId}))
  })

  describe('writeConfig()', () => {
    const writeConfig = vi.spyOn(ConfigAPI.prototype, 'writeConfig')

    afterEach(() => {
      vi.resetAllMocks()
    })
    it('should write the config to a file', async () => {
      configAPI.writeConfig()
      expect(writeConfig).toReturn()
    })

    it('should throw an error if the file cannot be written', async () => {
      const error = new Error('Something went wrong')
      writeConfig.mockImplementationOnce(() => {
        throw error
      })
      configAPI.writeConfig()
      expect(writeConfig).toThrowError('Something went wrong')
    })
  })
})
