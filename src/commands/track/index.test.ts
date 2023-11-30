import {Tracking} from 'dominos'
import {afterEach, describe, expect, it, vi} from 'vitest'

import {ConfigAPI} from '../../lib/config.js'
import Track from './index.js'

vi.mock('../../lib/config.js')

vi.mock('dominos', async (importOriginal) => {
  const mod = await importOriginal<typeof import('dominos')>()
  const Tracking = vi.fn()
  Tracking.prototype.byPhone = vi.fn()
  return {
    ...mod,
    Tracking,
  }
})

describe('TrackIndex', () => {
  // supress this.log
  vi.spyOn(Track.prototype, 'log')

  afterEach(async () => {
    vi.resetAllMocks()
  })

  it('should track an order with a phone number from a flag', async () => {
    const byPhone = vi.spyOn(Tracking.prototype, 'byPhone').mockResolvedValue({
      orderID: '12345',
      orderDescription: 'Order 12345',
      orderStatus: 'Pending',
    })
    const phone = '123-456-7890'

    await Track.run([`--phone=${phone}`])

    expect(byPhone).toHaveBeenCalledWith(phone)
  })

  it('should track an order with a phone number from the profile', async () => {
    const byPhone = vi.spyOn(Tracking.prototype, 'byPhone').mockResolvedValue({
      orderID: '12345',
      orderDescription: 'Order 12345',
      orderStatus: 'Pending',
    })
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

    await Track.run()

    expect(getProfile).toBeCalled()

    expect(byPhone).toHaveBeenCalledWith(testProfile.phone)
  })

  it('should log an error when no phone number is provided', async () => {
    const getProfile = vi.spyOn(ConfigAPI.prototype, 'getProfile')
    const byPhone = vi.spyOn(Tracking.prototype, 'byPhone')

    await Track.run()

    expect(getProfile).toBeCalled()

    expect(byPhone).not.toHaveBeenCalled()
  })
})
