/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import prompts from 'prompts'
import {afterEach, describe, expect, it, vi} from 'vitest'

import {ConfigAPI} from '../../lib/config.js'
import Update from './update.js'

vi.mock('../../lib/config.js')

describe('ProfileUpdate', () => {
  vi.spyOn(Update.prototype, 'log').mockImplementation(() => {})
  const updateProfile = vi.spyOn(ConfigAPI.prototype, 'updateProfile')

  afterEach(async () => {
    vi.resetAllMocks()
  })

  describe('getUpdatesFromPrompt', () => {
    it('should return the profile updates', async () => {
      const testUpdates = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        phone: '123-456-7890',
        address1: '123 Main St',
        address2: 'Suite 100',
        city: 'San Francisco',
        state: 'CA',
        zip: '94107',
      }

      prompts.inject([
        ['firstName', 'lastName', 'email', 'phone', 'address1', 'address2', 'city', 'state', 'zip'],
        testUpdates.firstName,
        testUpdates.lastName,
        testUpdates.email,
        testUpdates.phone,
        testUpdates.address1,
        testUpdates.address2,
        testUpdates.city,
        testUpdates.state,
        testUpdates.zip,
      ])
      const updates = await Update.prototype.getUpdatesFromPrompt()

      expect(updates).toEqual(testUpdates)
    })
  })

  it('should update the profile by passing fields as flags', async () => {
    const flags = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      phone: '555-555-5555',
      address1: '123 Main St',
      address2: 'Apt 1',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    }

    const args = Object.entries(flags).map(([key, value]) => `--${key}=${value}`)
    await Update.run(args)

    expect(updateProfile).toHaveBeenCalledWith(flags)
  })

  it('should not update the profile if updates are null', async () => {
    const getUpdatesFromPrompt = vi.spyOn(Update.prototype, 'getUpdatesFromPrompt').mockResolvedValue(null)

    await Update.run()

    expect(getUpdatesFromPrompt).toHaveBeenCalled()

    expect(updateProfile).to.not.toHaveBeenCalled()
  })

  it('should update the profile if updates are not null', async () => {
    const testUpdates = {
      firstName: 'John',
      email: 'johndoe@example.com',
      state: 'CA',
    }

    const getUpdatesFromPrompt = vi.spyOn(Update.prototype, 'getUpdatesFromPrompt').mockResolvedValue(testUpdates)

    await Update.run()

    expect(getUpdatesFromPrompt).toHaveBeenCalled()
    expect(updateProfile).toHaveBeenCalled()
  })
})
