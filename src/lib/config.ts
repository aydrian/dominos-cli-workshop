import {Address, Customer, Store} from 'dominos'
import * as fs from 'node:fs'

export interface Profile {
  address1: string
  address2: string
  city: string
  email: string
  firstName: string
  lastName: string
  phone: string
  state: string
  zip: string
}

interface Config {
  favoriteStoreId?: string
  profile?: Profile
}

export class ConfigAPI {
  private config: Config = {}
  private configFile = ''

  /**
   * Creates a new ConfigAPI instance.
   *
   * @param configDir The directory where the configuration file is located
   */
  constructor(configDir: string) {
    this.configFile = configDir
    this.config = this.readConfig()
  }

  /**
   * Returns the customer's information as a Dominos API `Customer` object.
   *
   * @returns The customer's information, or null if no customer is set up
   */
  getCustomer() {
    if (!this.config.profile) {
      return null
    }

    const {email, phone, firstName, lastName, ...addr} = this.config.profile
    const address = new Address({
      street: `${addr.address1}${addr.address2 ? ` ${addr.address2}` : ''}`,
      city: addr.city,
      region: addr.state,
      postalCode: addr.zip,
    })
    const customer = new Customer({address, firstName, lastName, email, phone})
    return customer
  }

  /**
   * Returns the customer's favorite store.
   *
   * @returns The customer's favorite store, or null if no favorite store is set up
   */
  async getFavoriteStore() {
    const {favoriteStoreId} = this.config
    if (!favoriteStoreId) {
      return null
    }

    const store = await new Store(favoriteStoreId)
    return store
  }

  /**
   * Returns the customer's profile information.
   *
   * @returns The customer's profile, or null if no profile is set up
   */
  getProfile() {
    return this.config.profile
  }

  /**
   * Reads the configuration file and returns the parsed data.
   *
   * If the configuration file does not exist, it will be created with an empty object.
   *
   * @returns The configuration data
   */
  readConfig() {
    if (!fs.existsSync(this.configFile)) {
      fs.writeFileSync(this.configFile, '{}', {encoding: 'utf8'})
    }

    const config: Config = JSON.parse(fs.readFileSync(this.configFile, {encoding: 'utf8'}))
    return config
  }

  /**
   * Saves the customer's profile information to the configuration file.
   *
   * @param profile The customer's profile information
   * @returns null
   */
  saveProfile(profile: Profile) {
    this.config.profile = profile
    this.writeConfig()
  }

  /**
   * Updates the favorite store ID in the configuration file.
   *
   * @param storeId The ID of the customer's favorite store
   * @returns null
   */
  updateFavoriteStore(storeId: string) {
    this.config.favoriteStoreId = storeId
    this.writeConfig()
  }

  /**
   * Updates the customer's profile information in the configuration file.
   *
   * @param profile The updated profile information
   * @throws {Error} If the customer's profile is not set up, an error will be thrown
   * @returns null
   */
  updateProfile(profile: Partial<Profile>) {
    if (!this.config.profile) {
      throw new Error('You need to set up your profile first!')
    }

    const updatedConfig = {...this.config.profile, ...profile}
    this.config.profile = updatedConfig
    this.writeConfig()
  }

  /**
   * Writes the current configuration to the configuration file.
   *
   * @param data The configuration data to write to the file
   * @returns null
   */
  writeConfig() {
    const data = JSON.stringify(this.config)
    fs.writeFileSync(this.configFile, data, {encoding: 'utf8'})
  }
}
