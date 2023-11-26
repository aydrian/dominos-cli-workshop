import {checkbox, input} from '@inquirer/prompts'
import {Command, Flags, ux} from '@oclif/core'

import {ConfigAPI, Profile} from '../../lib/config.js'

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

  public async run(): Promise<void> {
    const {flags} = await this.parse(ProfileUpdate)
    const configAPI = new ConfigAPI(this.config.configDir)

    if (Object.keys(flags).length > 0) {
      ux.action.start('Updating your profile...')
      configAPI.updateProfile(flags)
      ux.action.stop()
      return
    }

    const fields = await checkbox({
      message: 'Which fields would you like to update?',
      choices: [
        {
          name: 'First Name',
          value: 'firstName',
        },
        {
          name: 'Last Name',
          value: 'lastName',
        },
        {
          name: 'Email',
          value: 'email',
        },
        {
          name: 'Phone Number',
          value: 'phone',
        },
        {
          name: 'Address',
          value: 'address1',
        },
        {
          name: 'Address Line 2',
          value: 'address2',
        },
        {
          name: 'City',
          value: 'city',
        },
        {
          name: 'State',
          value: 'state',
        },
        {
          name: 'Zip Code',
          value: 'zip',
        },
      ],
    })

    if (fields.length === 0) {
      return this.log("You didn't select any fields to update. No changes made.")
    }

    const updates: Partial<Profile> = {}

    if (fields.includes('firstName')) {
      updates.firstName = await input({message: 'What is your first name?'})
    }

    if (fields.includes('lastName')) {
      updates.lastName = await input({message: 'What is your last name?'})
    }

    if (fields.includes('email')) {
      updates.email = await input({message: 'What is your email?'})
    }

    if (fields.includes('phone')) {
      updates.phone = await input({message: 'What is your phone number?'})
    }

    if (fields.includes('address1')) {
      updates.address1 = await input({message: 'What is your address?'})
    }

    if (fields.includes('address2')) {
      updates.address2 = await input({message: 'What is your address line 2?'})
    }

    if (fields.includes('city')) {
      updates.city = await input({message: 'What is your city?'})
    }

    if (fields.includes('state')) {
      updates.state = await input({message: 'What is your state?'})
    }

    if (fields.includes('zip')) {
      updates.zip = await input({message: 'What is your zip code?'})
    }

    try {
      ux.action.start('Updating your profile...')
      configAPI.updateProfile(updates)
      ux.action.stop()
    } catch (error) {
      ux.action.stop()
      const message = error instanceof Error ? error.message : String(error)
      this.log(message)
    }
  }
}
