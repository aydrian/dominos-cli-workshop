import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

import {ConfigAPI} from '../../lib/config.js'
import Store from './index.js'

vi.mock('../../lib/config.js')

describe('Store', () => {
  const log = vi.spyOn(Store.prototype, 'log')
  const getFavoriteStore = vi.spyOn(ConfigAPI.prototype, 'getFavoriteStore')

  beforeEach(() => {
    log.mockImplementation(() => {})
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should display message if no favorite store is set', async () => {
    await Store.run()

    expect(log).toHaveBeenCalledWith('You have not set up a favorite store yet.')
  })

  it('should display the favorite store if it exists', async () => {
    const favoriteStore = {
      info: {
        StoreID: 1,
        StreetName: '123 Main St',
        City: 'Anytown',
        Region: 'CA',
        PostalCode: '12345',
        Phone: '555-555-5555',
      },
    }

    // @ts-expect-error Only need a subset of the Store object
    getFavoriteStore.mockResolvedValue(favoriteStore)

    await Store.run()

    expect(log).toHaveBeenNthCalledWith(1, `Your favorite store is Store #${favoriteStore.info.StoreID}`)
    expect(log).toHaveBeenNthCalledWith(
      2,
      `${favoriteStore.info.StreetName}
${favoriteStore.info.City}, ${favoriteStore.info.Region} ${favoriteStore.info.PostalCode}
Phone: ${favoriteStore.info.Phone}`,
    )
  })
})
