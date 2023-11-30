/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import {NearbyStores} from 'dominos'
import prompts from 'prompts'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

import {ConfigAPI} from '../../lib/config.js'
import Search from './search.js'

vi.mock('../../lib/config.js')

vi.mock('dominos', async (importOriginal) => {
  const mod = await importOriginal<typeof import('dominos')>()
  return {
    ...mod,
    NearbyStores: vi.fn(),
  }
})

describe('StoreSearch', () => {
  const nearbyStores = {
    stores: [
      {
        StoreID: '1',
        AddressDescription: 'Store 1',
      },
      {
        StoreID: '2',
        AddressDescription: 'Store 2',
      },
    ],
  } as NearbyStores

  beforeEach(async () => {
    vi.mocked(NearbyStores).mockResolvedValue(nearbyStores)
  })

  afterEach(async () => {
    vi.resetAllMocks()
  })

  describe('getFavoriteStoreFromPrompt', () => {
    it('should return the selected store', async () => {
      prompts.inject(['1'])
      const response = await Search.prototype.getFavoriteStoreFromPrompt(nearbyStores)
      expect(response).toBe('1')
    })
  })

  it('should search for nearby stores when a zip code is provided', async () => {
    vi.spyOn(Search.prototype, 'getFavoriteStoreFromPrompt').mockResolvedValue('1')
    const flags = {zip: '12345'}

    await Search.run([`--zip=${flags.zip}`])

    expect(NearbyStores).toHaveBeenCalledWith(flags.zip)
  })

  it('should search for nearby stores when a profile exists', async () => {
    const testProfile = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com',
      phone: '123-456-7890',
      address1: '123 Main St',
      address2: 'Apt 1',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    }
    const getProfile = vi.spyOn(ConfigAPI.prototype, 'getProfile').mockReturnValue(testProfile)
    vi.spyOn(Search.prototype, 'getFavoriteStoreFromPrompt').mockResolvedValue('1')
    await Search.run()

    expect(getProfile).toBeCalled()

    expect(NearbyStores).toHaveBeenCalledWith(testProfile.zip)
  })

  it('should provide a message if no profile is found', async () => {
    const getProfile = vi.spyOn(ConfigAPI.prototype, 'getProfile')
    const updateFavoriteStore = vi.spyOn(ConfigAPI.prototype, 'updateFavoriteStore')

    await Search.run()

    expect(getProfile).toBeCalled()
    expect(NearbyStores).not.toHaveBeenCalled()
    expect(updateFavoriteStore).not.toHaveBeenCalled()
  })

  it('should prompt the user to select a store', async () => {
    const getFavoriteStoreFromPrompt = vi.spyOn(Search.prototype, 'getFavoriteStoreFromPrompt').mockResolvedValue('1')

    prompts.inject(['1'])
    await Search.run(['--zip=12345'])

    expect(getFavoriteStoreFromPrompt).toBeCalled()
  })

  it("should save the user's favorite store", async () => {
    const storeID = '1'
    const getFavoriteStoreFromPrompt = vi
      .spyOn(Search.prototype, 'getFavoriteStoreFromPrompt')
      .mockResolvedValue(storeID)

    const updateFavoriteStore = vi.spyOn(ConfigAPI.prototype, 'updateFavoriteStore')

    await Search.run(['--zip=12345'])

    expect(getFavoriteStoreFromPrompt).toHaveBeenCalled()

    expect(updateFavoriteStore).toHaveBeenCalledWith(storeID)
  })
})
