import {Command, Flags, ux} from '@oclif/core'
// eslint-disable-next-line import/no-named-as-default
import prompts from 'prompts'

import {ConfigAPI, Profile} from '../../lib/config.js'
import {stateChoices} from './index.js'

export default class ProfileUpdate extends Command {
  static description = 'Update profile'

  static examples = ['<%= config.bin %> <%= command.id %> --email <EMAIL>']

  static flags = {
    firstName: Flags.string({description: 'first name', aliases: ['first-name']}),
    lastName: Flags.string({description: 'last name', aliases: ['last-name']}),
    email: Flags.string({description: 'email'}),
    phone: Flags.string({description: 'phone'}),
    address1: Flags.string({description: 'address1'}),
    address2: Flags.string({description: 'address2'}),
    city: Flags.string({description: 'city'}),
    state: Flags.string({description: 'state'}),
    zip: Flags.string({description: 'zip'}),
  }

  public async getUpdatesFromPrompt(): Promise<Partial<Profile> | null> {
    const response = await prompts([
      {
        type: 'multiselect',
        name: 'fields',
        message: 'Which fields would you like to update?',
        choices: [
          {title: 'First Name', value: 'firstName'},
          {title: 'Last Name', value: 'lastName'},
          {title: 'Email', value: 'email'},
          {title: 'Phone', value: 'phone'},
          {title: 'Address 1', value: 'address1'},
          {title: 'Address 2', value: 'address2'},
          {title: 'City', value: 'city'},
          {title: 'State', value: 'state'},
          {title: 'Zip', value: 'zip'},
        ],
      },
      {
        type: (prev: string, values: Record<string, string | string[]>) =>
          values.fields.includes('firstName') ? 'text' : null,
        name: 'firstName',
        message: 'What is your first name?',
      },
      {
        type: (prev: string, values: Record<string, string | string[]>) =>
          values.fields.includes('lastName') ? 'text' : null,
        name: 'lastName',
        message: 'What is your last name?',
      },
      {
        type: (prev: string, values: Record<string, string | string[]>) =>
          values.fields.includes('email') ? 'text' : null,
        name: 'email',
        message: 'What is your email?',
      },
      {
        type: (prev: string, values: Record<string, string | string[]>) =>
          values.fields.includes('phone') ? 'text' : null,
        name: 'phone',
        message: 'What is your phone number?',
      },
      {
        type: (prev: string, values: Record<string, string | string[]>) =>
          values.fields.includes('address1') ? 'text' : null,
        name: 'address1',
        message: 'What is your address?',
      },
      {
        type: (prev: string, values: Record<string, string | string[]>) =>
          values.fields.includes('address2') ? 'text' : null,
        name: 'address2',
        message: 'What is your address (line 2)?',
      },
      {
        type: (prev: string, values: Record<string, string | string[]>) =>
          values.fields.includes('city') ? 'text' : null,
        name: 'city',
        message: 'What is your city?',
      },
      {
        type: (prev: string, values: Record<string, string | string[]>) =>
          values.fields.includes('state') ? 'autocomplete' : null,
        name: 'state',
        message: 'What is your state?',
        choices: stateChoices,
      },
      {
        type: (prev: string, values: Record<string, string | string[]>) =>
          values.fields.includes('zip') ? 'text' : null,
        name: 'zip',
        message: 'What is your zip code?',
      },
    ])

    const {fields, ...profile} = response

    if (fields.length === 0) {
      return null
    }

    return profile
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(ProfileUpdate)
    const configAPI = new ConfigAPI(this.config.configDir)

    if (Object.keys(flags).length > 0) {
      ux.action.start('Updating your profile...')
      configAPI.updateProfile(flags)
      ux.action.stop()
      return
    }

    const updates = await this.getUpdatesFromPrompt()

    if (!updates) {
      return this.log("You didn't select any fields to update. No changes made.")
    }

    ux.action.start('Updating your profile...')
    configAPI.updateProfile(updates)
    ux.action.stop()
  }
}
