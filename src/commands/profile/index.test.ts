/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import prompts from 'prompts'
import {afterEach, describe, expect, it, vi} from 'vitest'

import {ConfigAPI} from '../../lib/config.js'
import Profile from './index.js'

vi.mock('../../lib/config.js')

describe('Profile', () => {
  const getProfile = vi.spyOn(ConfigAPI.prototype, 'getProfile')
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

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getProfileFromPrompt', () => {
    it('should return a profile with the given information', async () => {
      const {firstName, lastName, email, phone, address1, address2, city, state, zip} = testProfile

      prompts.inject([firstName, lastName, email, phone, address1, address2, city, state, zip])
      const profile = await Profile.prototype.getProfileFromPrompt()

      expect(profile).toEqual(testProfile)
    })
  })

  it('should display the profile if it exists', async () => {
    const getProfileFromPrompt = vi.spyOn(Profile.prototype, 'getProfileFromPrompt').mockResolvedValue(testProfile)
    getProfile.mockReturnValue(testProfile)

    await Profile.run()

    expect(getProfile).toHaveBeenCalled()

    expect(getProfileFromPrompt).to.not.toHaveBeenCalled()
  })

  it('should prompt the user for a profile and save it if it does not exist', async () => {
    const saveProfile = vi.spyOn(ConfigAPI.prototype, 'saveProfile')

    const getProfileFromPrompt = vi.spyOn(Profile.prototype, 'getProfileFromPrompt').mockResolvedValue(testProfile)

    await Profile.run()

    expect(getProfile).toHaveBeenCalled()

    expect(getProfileFromPrompt).toHaveBeenCalled()

    expect(saveProfile).toHaveBeenCalledWith(testProfile)
  })
})
