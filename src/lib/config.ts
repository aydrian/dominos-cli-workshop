import Conf from 'conf'
import {Address, Customer, Store, StoreIDType} from 'dominos'

export interface Profile {
  address1: string
  address2?: string
  city: string
  email: string
  firstName: string
  lastName: string
  phone: string
  state: string
  zip: string
}

export class ConfigAPI {
  private config: Conf

  /**
   * Creates a new ConfigAPI instance.
   *
   * @param configDir The directory where the configuration file is located
   */
  constructor() {
    this.config = new Conf({projectName: 'dominos-cli'})
  }

  getConfig() {
    return this.config
  }

  /**
   * Returns the customer's information as a Dominos API `Customer` object.
   *
   * @returns The customer's information, or null if no customer is set up
   */
  getCustomer() {
    if (!this.config.get('profile')) {
      return null
    }

    const {email, phone, firstName, lastName, ...addr} = this.config.get('profile') as Profile
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
    if (!this.config.get('favoriteStoreId')) {
      return null
    }

    const favoriteStoreId = this.config.get('favoriteStoreId') as StoreIDType

    const store = await new Store(favoriteStoreId)
    return store
  }

  /**
   * Returns the customer's profile information.
   *
   * @returns The customer's profile, or null if no profile is set up
   */
  getProfile() {
    return this.config.get('profile') as Profile
  }

  /**
   * Saves the customer's profile information to the configuration file.
   *
   * @param profile The customer's profile information
   * @returns null
   */
  saveProfile(profile: Profile) {
    this.config.set('profile', profile)
  }

  /**
   * Updates the favorite store ID in the configuration file.
   *
   * @param storeId The ID of the customer's favorite store
   * @returns null
   */
  updateFavoriteStore(storeId: string) {
    this.config.set('favoriteStoreId', storeId)
  }

  /**
   * Updates the customer's profile information in the configuration file.
   *
   * @param profile The updated profile information
   * @returns null
   */
  updateProfile(profile: Partial<Profile>) {
    const currentProfile = this.config.get('profile') as Profile
    const updatedConfig = {...currentProfile, ...profile}
    // @ts-expect-error remove this as part of Part 7
    this.config.profile = updatedConfig
  }
}
