import {checkbox, input} from '@inquirer/prompts'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

import {ConfigAPI} from '../../lib/config.js'
import Update from './update.js'

vi.mock('../../lib/config.js')

vi.mock('@inquirer/prompts', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@inquirer/prompts')>()
  return {
    ...mod,
    checkbox: vi.fn(),
    input: vi.fn(),
  }
})

describe('ProfileUpdate', () => {
  const log = vi.spyOn(Update.prototype, 'log')
  const updateProfile = vi.spyOn(ConfigAPI.prototype, 'updateProfile')

  beforeEach(async () => {
    log.mockImplementation(() => {})
  })

  afterEach(async () => {
    vi.resetAllMocks()
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

  it('should not update the profile if no fields are selected to update', async () => {
    vi.mocked(checkbox).mockResolvedValueOnce([])
    expect(updateProfile).toBeCalledTimes(0)
  })

  it('should prompt for selected fields', async () => {
    const prompts = [
      {name: 'firstName', input: 'John', message: 'What is your first name?'},
      {name: 'lastName', input: 'Doe', message: 'What is your last name?'},
      {name: 'email', input: 'johndoe@example.com', message: 'What is your email?'},
      {name: 'phone', input: '555-555-5555', message: 'What is your phone number?'},
      {name: 'address1', input: '123 Main St', message: 'What is your address?'},
      {name: 'address2', input: 'Apt 1', message: 'What is your address line 2?'},
      {name: 'city', input: 'Anytown', message: 'What is your city?'},
      {name: 'state', input: 'CA', message: 'What is your state?'},
      {name: 'zip', input: '12345', message: 'What is your zip code?'},
    ]

    vi.mocked(checkbox).mockResolvedValueOnce(prompts.map(({name}) => name))

    for (const prompt of prompts) vi.mocked(input).mockResolvedValueOnce(prompt.input)

    await Update.run()

    for (const [index, {message}] of prompts.entries()) {
      expect(input).toHaveBeenNthCalledWith(index + 1, {message})
    }

    const updatedProfile = Object.fromEntries(prompts.map(({input, name}) => [name, input]))
    expect(updateProfile).toHaveBeenCalledWith(updatedProfile)
  })

  it('should handle errors gracefully', async () => {
    const error = new Error('Something went wrong')
    updateProfile.mockImplementationOnce(() => {
      throw error
    })

    vi.mocked(checkbox).mockResolvedValueOnce(['firstName'])
    vi.mocked(input).mockResolvedValueOnce('John')

    await Update.run()

    expect(log).toHaveBeenCalledWith('Something went wrong')
  })
})
