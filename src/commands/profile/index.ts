import {input} from '@inquirer/prompts'
import {Command, ux} from '@oclif/core'
import chalk from 'chalk'

import {ConfigAPI} from '../../lib/config.js'

export default class Profile extends Command {
  static args = {}

  static description = 'Get profile'

  static examples = [`$ dominos profile`]

  static flags = {}

  async run(): Promise<void> {
    const configAPI = new ConfigAPI(this.config.configDir)
    const profile = configAPI.getProfile()

    if (profile) {
      // display the profile
      this.log(chalk.blue.bold('Name'))
      this.log(`${profile.firstName} ${profile.lastName}`)
      this.log(chalk.blue.bold('Email'))
      this.log(`${profile.email}`)
      this.log(chalk.blue.bold('Phone'))
      this.log(`${profile.phone}`)
      this.log(chalk.blue.bold('Address'))
      this.log(`${profile.address1}`)
      if (profile.address2) {
        this.log(`${profile.address2}`)
      }

      this.log(`${profile.city}, ${profile.state}  ${profile.zip}`)
    } else {
      // prompt the user for a profile and save it
      this.log("Your profile was empty, let's set it up!")

      const newProfile = {
        firstName: await input({message: 'What is your first name?'}),
        lastName: await input({message: 'What is your last name?'}),
        email: await input({message: 'What is your email?'}),
        phone: await input({message: 'What is your phone number?'}),
        address1: await input({message: 'What is your address?'}),
        address2: await input({message: 'What is your address (line2)?'}),
        city: await input({message: 'What is your city?'}),
        state: await input({message: 'What is your state?'}),
        zip: await input({message: 'What is your zip code?'}),
      }

      ux.action.start('Saving your profile...')
      configAPI.saveProfile(newProfile)
      ux.action.stop()
    }
  }
}
