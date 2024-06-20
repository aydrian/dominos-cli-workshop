import {Command} from '@oclif/core'
import chalk from 'chalk'
import ora from 'ora'
// eslint-disable-next-line import/no-named-as-default
import prompts from 'prompts'

import {ConfigAPI, type Profile as ProfileType} from '../../lib/config.js'

export default class Profile extends Command {
  static args = {}

  static description = 'Get profile'

  static examples = [`$ dominos profile`]

  static flags = {}

  public async getProfileFromPrompt(): Promise<ProfileType> {
    const profile = await prompts([
      {type: 'text', name: 'firstName', message: 'What is your first name?'},
      {type: 'text', name: 'lastName', message: 'What is your last name?'},
      {type: 'text', name: 'email', message: 'What is your email?'},
      {type: 'text', name: 'phone', message: 'What is your phone number?'},
      {type: 'text', name: 'address1', message: 'What is your address?'},
      {type: 'text', name: 'address2', message: 'What is your address (line 2)?'},
      {type: 'text', name: 'city', message: 'What is your city?'},
      {type: 'text', name: 'state', message: 'What is your state?'},
      {type: 'text', name: 'zip', message: 'What is your zip code?'},
    ])

    return profile
  }

  public async run(): Promise<void> {
    const spinner = ora()
    const configAPI = new ConfigAPI()
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

      const newProfile = await this.getProfileFromPrompt()

      spinner.start('Saving your profile...')
      configAPI.saveProfile(newProfile)
      spinner.stop()
    }
  }
}
