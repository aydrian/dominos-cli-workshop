import {Command, ux} from '@oclif/core'
import chalk from 'chalk'
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
      {type: 'autocomplete', name: 'state', message: 'What is your state?', choices: stateChoices},
      {type: 'text', name: 'zip', message: 'What is your zip code?'},
    ])

    return profile
  }

  public async run(): Promise<void> {
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

      const newProfile = await this.getProfileFromPrompt()

      ux.action.start('Saving your profile...')
      configAPI.saveProfile(newProfile)
      ux.action.stop()
    }
  }
}

export const stateChoices = [
  {title: 'Alabama', value: 'AL'},
  {title: 'Alaska', value: 'AK'},
  {title: 'Arizona', value: 'AZ'},
  {title: 'Arkansas', value: 'AR'},
  {title: 'California', value: 'CA'},
  {title: 'Colorado', value: 'CO'},
  {title: 'Connecticut', value: 'CT'},
  {title: 'Delaware', value: 'DE'},
  {title: 'District Of Columbia', value: 'DC'},
  {title: 'Florida', value: 'FL'},
  {title: 'Georgia', value: 'GA'},
  {title: 'Hawaii', value: 'HI'},
  {title: 'Idaho', value: 'ID'},
  {title: 'Illinois', value: 'IL'},
  {title: 'Indiana', value: 'IN'},
  {title: 'Iowa', value: 'IA'},
  {title: 'Kansas', value: 'KS'},
  {title: 'Kentucky', value: 'KY'},
  {title: 'Louisiana', value: 'LA'},
  {title: 'Maine', value: 'ME'},
  {title: 'Maryland', value: 'MD'},
  {title: 'Massachusetts', value: 'MA'},
  {title: 'Michigan', value: 'MI'},
  {title: 'Minnesota', value: 'MN'},
  {title: 'Mississippi', value: 'MS'},
  {title: 'Missouri', value: 'MO'},
  {title: 'Montana', value: 'MT'},
  {title: 'Nebraska', value: 'NE'},
  {title: 'Nevada', value: 'NV'},
  {title: 'New Hampshire', value: 'NH'},
  {title: 'New Jersey', value: 'NJ'},
  {title: 'New Mexico', value: 'NM'},
  {title: 'New York', value: 'NY'},
  {title: 'North Carolina', value: 'NC'},
  {title: 'North Dakota', value: 'ND'},
  {title: 'Ohio', value: 'OH'},
  {title: 'Oklahoma', value: 'OK'},
  {title: 'Oregon', value: 'OR'},
  {title: 'Pennsylvania', value: 'PA'},
  {title: 'Rhode Island', value: 'RI'},
  {title: 'South Carolina', value: 'SC'},
  {title: 'South Dakota', value: 'SD'},
  {title: 'Tennessee', value: 'TN'},
  {title: 'Texas', value: 'TX'},
  {title: 'Utah', value: 'UT'},
  {title: 'Vermont', value: 'VT'},
  {title: 'Virginia', value: 'VA'},
  {title: 'Washington', value: 'WA'},
  {title: 'West Virginia', value: 'WV'},
  {title: 'Wisconsin', value: 'WI'},
  {title: 'Wyoming', value: 'WY'},
]
