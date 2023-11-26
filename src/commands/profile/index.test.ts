import {input} from '@inquirer/prompts'
import chalk from 'chalk'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

import {ConfigAPI} from '../../lib/config.js'
import Profile from './index.js'

vi.mock('../../lib/config.js')

vi.mock('@inquirer/prompts', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@inquirer/prompts')>()
  return {
    ...mod,
    input: vi.fn(),
  }
})

describe('Profile', () => {
  const log = vi.spyOn(Profile.prototype, 'log')
  const getProfile = vi.spyOn(ConfigAPI.prototype, 'getProfile')

  beforeEach(() => {
    log.mockImplementation(() => {})
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should display the profile if it exists', async () => {
    const profile = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com',
      phone: '555-555-5555',
      address1: '123 Main St',
      address2: 'Apt 1',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    }

    getProfile.mockReturnValue(profile)

    await Profile.run()

    expect(log).toHaveBeenNthCalledWith(1, chalk.blue.bold('Name'))
    expect(log).toHaveBeenNthCalledWith(2, `${profile.firstName} ${profile.lastName}`)
    expect(log).toHaveBeenNthCalledWith(3, chalk.blue.bold('Email'))
    expect(log).toHaveBeenNthCalledWith(4, profile.email)
    expect(log).toHaveBeenNthCalledWith(5, chalk.blue.bold('Phone'))
    expect(log).toHaveBeenNthCalledWith(6, `${profile.phone}`)
    expect(log).toHaveBeenNthCalledWith(7, chalk.blue.bold('Address'))
    expect(log).toHaveBeenNthCalledWith(8, `${profile.address1}`)
    expect(log).toHaveBeenNthCalledWith(9, `${profile.address2}`)
    expect(log).toHaveBeenNthCalledWith(10, `${profile.city}, ${profile.state}  ${profile.zip}`)
  })

  it('should prompt the user for a profile and save it if it does not exist', async () => {
    const saveProfile = vi.spyOn(ConfigAPI.prototype, 'saveProfile')

    const prompts = [
      {name: 'firstName', message: 'What is your first name?', input: 'John'},
      {name: 'lastName', message: 'What is your last name?', input: 'Doe'},
      {name: 'email', message: 'What is your email?', input: 'john@doe.com'},
      {name: 'phone', message: 'What is your phone number?', input: '555-555-5555'},
      {name: 'address1', message: 'What is your address?', input: '123 Main St'},
      {name: 'address2', message: 'What is your address (line2)?', input: 'Apt 1'},
      {name: 'city', message: 'What is your city?', input: 'Anytown'},
      {name: 'state', message: 'What is your state?', input: 'CA'},
      {name: 'zip', message: 'What is your zip code?', input: '12345'},
    ]

    for (const prompt of prompts) vi.mocked(input).mockResolvedValueOnce(prompt.input)

    await Profile.run()

    expect(getProfile).toHaveBeenCalled()
    expect(log).toHaveBeenNthCalledWith(1, "Your profile was empty, let's set it up!")

    for (const [index, {message}] of prompts.entries()) {
      expect(input).toHaveBeenNthCalledWith(index + 1, {message})
    }

    const newProfile = Object.fromEntries(prompts.map(({input, name}) => [name, input]))
    expect(saveProfile).toHaveBeenCalledWith(newProfile)
  })
})
