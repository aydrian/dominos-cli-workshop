import {select} from '@inquirer/prompts'
import {NearbyStores} from 'dominos'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

import {ConfigAPI} from '../../lib/config.js'
import Search from './search.js'

vi.mock('../../lib/config.js')

vi.mock('@inquirer/prompts', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@inquirer/prompts')>()
  return {
    ...mod,
    select: vi.fn(),
  }
})

vi.mock('dominos', async (importOriginal) => {
  const mod = await importOriginal<typeof import('dominos')>()
  return {
    ...mod,
    NearbyStores: vi.fn(),
  }
})

describe('StoreSearch', () => {
  const log = vi.spyOn(Search.prototype, 'log')

  beforeEach(() => {
    log.mockImplementation(() => {})
  })

  afterEach(async () => {
    vi.resetAllMocks()
  })

  it('should search for nearby stores when a zip code is provided', async () => {
    const flags = {zip: '10001'}
    vi.mocked(NearbyStores).mockResolvedValue({address: {}, stores: []})

    const args = Object.entries(flags).map(([key, value]) => `--${key}=${value}`)
    await Search.run(args)

    expect(NearbyStores).toHaveBeenCalledWith('10001')
  })

  it('should search for nearby stores when a profile exists', async () => {
    const profile = {zip: '12345'}
    const spy = vi.spyOn(NearbyStores.prototype, 'stores')
    ConfigAPI.prototype.getProfile = vi.fn().mockReturnValue(profile)

    await Search.run()

    expect(spy).toHaveBeenCalledWith('12345')
    spy.mockRestore()
  })

  it('should prompt the user to select a store', async () => {
    const spy = vi.mocked(select)

    await Search.run()

    expect(spy).toHaveBeenCalledWith({
      message: 'Which store would you like to favorite?',
      choices: [],
    })
    spy.mockRestore()
  })

  it("should save the user's favorite store", async () => {
    const favoriteStoreId = '12345'
    const spy = vi.spyOn(ConfigAPI.prototype, 'updateFavoriteStore')

    await Search.run()

    expect(spy).toHaveBeenCalledWith(favoriteStoreId)
    spy.mockRestore()
  })
})
