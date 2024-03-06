import {Address, Customer} from 'dominos'
import {vol} from 'memfs'
import * as fs from 'node:fs'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

import {ConfigAPI, type Profile} from './config.js'

vi.mock('node:fs', async () => {
  const memfs = await vi.importActual<typeof import('memfs')>('memfs')
  return memfs.fs
})
vi.mock('dominos', async (importOriginal) => {
  const mod = await importOriginal<typeof import('dominos')>()
  return {
    ...mod,
  }
})

describe('Config API', () => {
  let configAPI: ConfigAPI
  const testProfile: Profile = {
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

  beforeEach(async () => {
    vol.reset()
    vol.fromJSON({'./README.md': '1'}, '/tmp')
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getCustomer', () => {
    it('should return null if no customer profile is set', () => {
      configAPI = new ConfigAPI('/tmp')
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

      vol.fromJSON({'config.json': JSON.stringify({profile})}, '/tmp')
      const configAPI = new ConfigAPI('/tmp')
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

    it('should return a customer with no address2', () => {
      const profile: Profile = {
        address1: '123 Main St',
        city: 'Anytown',
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '555-555-5555',
        state: 'CA',
        zip: '12345',
      }

      vol.fromJSON({'config.json': JSON.stringify({profile})}, '/tmp')
      const configAPI = new ConfigAPI('/tmp')
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
  })

  describe('getFavoriteStore', () => {
    it('should return null if no favorite store is set', async () => {
      configAPI = new ConfigAPI('/tmp')
      const favoriteStore = await configAPI.getFavoriteStore()
      expect(favoriteStore).toBeNull()
    })

    it('should return the favorite store if it is set', async () => {
      const storeId = '4332'
      vol.fromJSON({'config.json': JSON.stringify({favoriteStoreId: storeId})}, '/tmp')
      configAPI = new ConfigAPI('/tmp')
      const favoriteStore = await configAPI.getFavoriteStore()

      expect(favoriteStore?.info.StoreID?.toString()).toEqual(storeId)
    })
  })

  describe('readConfig', () => {
    it('should create a new configuration file if it does not exist', () => {
      expect(fs.existsSync('/tmp/config.json')).toBe(false)
      const configAPI = new ConfigAPI('/tmp')
      configAPI.readConfig()
      expect(fs.existsSync('/tmp/config.json')).toBe(true)
    })

    it('should read the configuration file if it exists', () => {
      const config = {profile: {firstName: 'John'}}
      vol.fromJSON({'config.json': JSON.stringify(config)}, '/tmp')
      const configAPI = new ConfigAPI('/tmp')
      configAPI.readConfig()
      expect(configAPI.getConfig()).toEqual(config)
    })
  })

  describe('saveProfile', () => {
    it('should save the profile to the configuration file', () => {
      const configAPI = new ConfigAPI('/tmp')
      configAPI.saveProfile(testProfile)
      expect(configAPI.getConfig().profile).toEqual(testProfile)
    })
  })

  describe('updateFavoriteStore', () => {
    it('should update the favorite store ID in the configuration file', () => {
      const configAPI = new ConfigAPI('/tmp')
      const storeId = '4332'
      configAPI.updateFavoriteStore(storeId)
      expect(configAPI.getConfig().favoriteStoreId).toEqual(storeId)
    })
  })

  describe('updateProfile', () => {
    it('should throw an error if the customer profile is not set up', () => {
      const configAPI = new ConfigAPI('/tmp')
      const updateProfile = () => configAPI.updateProfile({} as Profile)
      expect(updateProfile).toThrowError()
    })

    it('should update the customer profile', () => {
      vol.fromJSON({'config.json': JSON.stringify({profile: testProfile})}, '/tmp')
      const configAPI = new ConfigAPI('/tmp')
      const updates = {firstName: 'John'}
      configAPI.updateProfile(updates)
      expect(configAPI.getProfile()).toEqual({...testProfile, ...updates})
    })
  })

  describe('writeConfig', () => {
    it('should write the config to a file', async () => {
      const configAPI = new ConfigAPI('/tmp')
      configAPI.readConfig()
      configAPI.writeConfig()
      expect(fs.readFileSync('/tmp/config.json', {encoding: 'utf8'})).toEqual('{}')
    })
  })
})
