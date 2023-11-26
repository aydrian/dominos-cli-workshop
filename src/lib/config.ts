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

  constructor(configDir: string) {
    this.configFile = configDir
    this.config = this.readConfig()
  }

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

  async getFavoriteStore() {
    const {favoriteStoreId} = this.config
    if (!favoriteStoreId) {
      return null
    }

    const store = await new Store(favoriteStoreId)
    return store
  }

  getProfile() {
    return this.config.profile
  }

  readConfig() {
    if (!fs.existsSync(this.configFile)) {
      fs.writeFileSync(this.configFile, '{}', {encoding: 'utf8'})
    }

    const config: Config = JSON.parse(fs.readFileSync(this.configFile, {encoding: 'utf8'}))
    return config
  }

  saveProfile(profile: Profile) {
    this.config.profile = profile
    this.writeConfig()
  }

  updateFavoriteStore(storeId: string) {
    this.config.favoriteStoreId = storeId
    this.writeConfig()
  }

  updateProfile(profile: Partial<Profile>) {
    if (!this.config.profile) {
      throw new Error('You need to set up your profile first!')
    }

    const updatedConfig = {...this.config.profile, ...profile}
    this.config.profile = updatedConfig
    this.writeConfig()
  }

  writeConfig() {
    const data = JSON.stringify(this.config)
    fs.writeFileSync(this.configFile, data, {encoding: 'utf8'})
  }
}
