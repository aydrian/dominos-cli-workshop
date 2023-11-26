// eslint-disable @perfectionist/sort-interfaces
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/**
 * References @types/node
 */

/// <reference types="node" />

/**
 * Domino's
 */

declare module 'dominos' {
  /**
   * Item
   */

  type IDType = number
  type CodeType = string
  type QtyType = number
  type OptionsType = {}
  type IsNewType = boolean

  interface IItem {
    /**
     * This number will auto increment with each item created, you do not need to do anything unless you want specific ids on your items.
     */
    iD?: IDType

    /**
     * The product code, like **14SCREEN** for a 14' cheese pizza.
     */
    code: CodeType

    /**
     * The quantity of the item to order, defaults to 1 if not specified.
     */
    qty?: QtyType

    /**
     * The special options for these items, options supported for various products can be found in the menu entries for the item.
     */
    options?: OptionsType

    /**
     * Suggested you do not modify this. Tells the Domino's API if this is a new item. If set to false, Domino's will not return duplicate information for this item.
     */
    isNew?: IsNewType
  }

  declare class Item implements IItem {
    public iD: IDType
    public code: CodeType
    public qty: QtyType
    public options: OptionsType
    public isNew: IsNewType

    constructor({iD, code, qty, options, isNew}: IItem)
  }

  /**
   * Customer
   */

  type AddressType = Address | IAddressObject | AddressStringType
  type FirstNameType = string
  type LastNameType = string
  type EmailType = string
  type PhoneType = string
  type PhonePrefixType = string

  interface ICustomer {
    /**
     * Customer's address.
     */
    address: AddressType

    /**
     * First name.
     */
    firstName: FirstNameType

    /**
     * Last name.
     */
    lastName: LastNameType

    /**
     * Email.
     */
    email: EmailType

    /**
     * Phone.
     */
    phone: PhoneType

    /**
     * Phone prefix.
     */
    phonePrefix?: PhonePrefixType
  }

  declare class Customer implements ICustomer {
    public address: AddressType
    public firstName: FirstNameType
    public lastName: LastNameType
    public email: EmailType
    public phone: PhoneType
    public phonePrefix: PhonePrefixType

    constructor({address, firstName, lastName, email, phone, phonePrefix}: ICustomer)
  }

  /**
   * Address
   */

  type StreetType = string
  type StreetNameType = string
  type StreetNumberType = string
  type UnitTypeType = string
  type UnitNumberType = string
  type CityType = string
  type RegionType = string
  type PostalCodeType = string
  type DeliveryInstructionsType = string

  interface IAddressObject {
    /**
     * Street address (most commonly used to combine street number, name and apartment number).
     */
    street?: StreetType

    /**
     * Street name.
     */
    streetName?: StreetNameType

    /**
     * Street number.
     */
    streetNumber?: StreetNumberType

    /**
     * Unit type: suite, apartment, etc.
     */
    unitType?: UnitTypeType

    /**
     * Apartment number.
     */
    unitNumber?: UnitNumberType

    /**
     * Address city.
     */
    city?: CityType

    /**
     * In the US this would be the state. In other countries it may be the province, or prefecture.
     */
    region?: RegionType

    /**
     * Address postal, or zip code.
     */
    postalCode?: PostalCodeType

    /**
     * This is for special instructions, like "ring the bell", or "please don't give the Pizza to the old lady out front, she is not my Grandma, and always steals my food deliveries".
     */
    deliveryInstructions?: DeliveryInstructionsType
  }

  type AddressStringType = string

  declare class Address {
    public street: StreetType
    public streetNumber: StreetNameType
    public streetName: StreetNumberType
    public unitType: UnitTypeType
    public unitNumber: UnitNumberType
    public city: CityType
    public region: RegionType
    public postalCode: PostalCodeType
    public deliveryInstructions: DeliveryInstructionsType

    constructor(address: AddressType)
  }

  /**
   * NearbyStores
   */

  type PickUpType = 'Delivery' | 'Carryout' | 'all'
  type DominosAPIResponseType = Record<string, any>

  declare class NearbyStores {
    /**
     * An Address instance populated with the Domino's `Store` information.
     */
    public address: Address

    /**
     * Array of basic store Objects.
     */
    public stores: BasicStoreInfoType[]

    /**
     * Raw response from Domino's. Each response is a little different, but you can see the core info in the Domino's API Response docs.
     */
    public dominosAPIResponse: DominosAPIResponseType

    constructor(
      /**
       * Address instance, object, or string.
       */
      address: AddressType,
      /**
       * Type of pick up.
       */
      type?: PickUpType,
    )
  }

  /**
   * AmountsBreakdown
   */

  type FoodAndBeverageType = string
  type AdjustmentType = string
  type SurchargeType = string
  type DeliveryFeeType = string
  type TaxType = number
  type Tax1Type = number
  type Tax2Type = number
  type Tax3Type = number
  type Tax4Type = number
  type Tax5Type = number
  type BottleType = number
  type CustomerType = number
  type RoundingAdjustmentType = number
  type CashType = number
  type SavingsType = string

  interface IAmountsBreakdown {
    /**
     * Cost of the food, and beverage.
     */
    foodAndBeverage?: FoodAndBeverageType

    /**
     * Lacks information.
     */
    adjustment?: AdjustmentType

    /**
     * Lacks information.
     */
    surcharge?: SurchargeType

    /**
     * Delivery fee.
     */
    deliveryFee?: DeliveryFeeType

    /**
     * Main tax.
     */
    tax?: TaxType

    /**
     * Lacks information.
     */
    tax1?: Tax1Type

    /**
     * Lacks information.
     */
    tax2?: Tax2Type

    /**
     * Lacks information.
     */
    tax3?: Tax3Type

    /**
     * Lacks information.
     */
    tax4?: Tax4Type

    /**
     * Lacks information.
     */
    tax5?: Tax5Type

    /**
     * Lacks information.
     */
    bottle?: BottleType

    /**
     * Total order price for the customer.
     */
    customer?: ICustomer

    /**
     * Lacks information.
     */
    roundingAdjustment?: RoundingAdjustmentType

    /**
     * Lacks information.
     */
    cash?: CashType

    /**
     * Lacks information.
     */
    savings?: SavingsType
  }

  declare class AmountsBreakdown implements IAmountsBreakdown {
    foodAndBeverage: FoodAndBeverageType
    adjustment: AdjustmentType
    surcharge: SurchargeType
    deliveryFee: DeliveryFeeType
    tax: TaxType
    tax1: Tax1Type
    tax2: Tax2Type
    tax3: Tax3Type
    tax4: Tax4Type
    tax5: Tax5Type
    bottle: BottleType
    customer: CustomerType
    roundingAdjustment: RoundingAdjustmentType
    cash: CashType
    savings: SavingsType

    constructor({
      foodAndBeverage,
      adjustment,
      surcharge,
      deliveryFee,
      tax,
      tax1,
      tax2,
      tax3,
      tax4,
      tax5,
      bottle,
      customer,
      roundingAdjustment,
      cash,
      savings,
    }: IAmountsBreakdown)
  }

  /**
   * Order
   */

  declare class Order {
    /**
     * Address for customer.
     */
    public address: Address

    /**
     * Lacks information.
     */
    public amounts: any

    /**
     * Populated by `order.price`, this is the break down of costs and taxes.
     */
    public amountsBreakdown: AmountsBreakdown

    /**
     * This is the date the order was created at the business.
     */
    public businessDate: string

    /**
     * This is an array of coupon codes.
     */
    public coupons: []

    /**
     * This is the currency for the order, like USD. It will be populated by Domino's.
     */
    public currency: string

    /**
     * If the customer has an ID set it here. Not tested, may work.
     */
    public customerID: string

    /**
     *  Estimated wait time from when the order is placed and paid for.
     */
    public estimatedWaitMinutes: string

    /**
     * Customer's email, pupulated when instantiated by the passed `Customer` Object.
     */
    public email: string

    /**
     * Phone extension.
     */
    public extension: string

    /**
     * Customer's first name, pupulated when instantiated by the passed `Customer` Object.
     */
    public firstName: string

    /**
     * Lacks information.
     */
    public hotspotsLite: boolean

    /**
     * The IP where you are making requests from, Domino's servers will auto-populate this.
     */
    public iP: string

    /**
     *  Customer's last name, populated when instantiated by the passed `Customer` Object.
     */
    public lastName: string

    /**
     * Appears to be a two letter language code.
     */
    public languageCode: string

    /**
     * Domino's populates this based on where the order is happening.
     */
    public market: string

    /**
     * Domino's passes various important meta data objects here, like `prop65 warning` to let you know that pizza causes cancer in California.
     */
    public metaData: any

    /**
     * Lacks information.
     */
    public newUser: boolean

    /**
     * Lacks information.
     */
    public noCombine: boolean

    /**
     * Lacks information.
     */
    public orderChannel: string

    /**
     * The ID of the order.
     */
    public orderID: string

    /**
     * Lacks information.
     */
    public orderInfoCollection: []

    /**
     * Lacks information.
     */
    public orderMethod: string

    /**
     * Lacks information.
     */
    public orderTaker: string

    /**
     * Lacks information.
     */
    public partners: {}

    /**
     * This is how you pay for the order when you use the `.place` method.
     */
    public payments: Payment[]

    /**
     * Customer's phone number, pupulated when instantiated by the passed `Customer` Object.
     */
    public phone: string

    /**
     * Phone prefix.
     */
    public phonePrefix: string

    /**
     * Lacks information.
     */
    public priceOrderMs: number

    /**
     * The time when the order was priced by the `.price` method.
     */
    public priceOrderTime: string

    /**
     * Your product items are sanitized and added here by the `.addProduct` method.
     */
    public products: Item[]

    /**
     * Lacks information.
     */
    public promotions: []

    /**
     * Lacks information.
     */
    public pulseOrderGuid: string

    /**
     * How you plan to get your pizza. 'Delivery', 'Carryout', 'DriveUpCarryout'.
     */
    public serviceMethod: string

    /**
     * Lacks information.
     */
    public sourceOrganizationURI: string

    /**
     * ID for the store you wish to order from. Get this through the `NearbyStores` class.
     */
    public storeID: string | number

    /**
     * Lacks information.
     */
    public tags: {}

    /**
     * Auto-populated when requests are made. We use `node-fetch`.
     */
    public userAgent: string

    /**
     * Dominos.com API version.
     */
    public version: string

    /**
     * This will populate all Customer fields on the Order instance.
     */
    addCustomer: (Customer) => this

    /**
     * This will add a coupon string to the coupons array.
     */
    addCoupon: (couponCode: string) => this

    /**
     * This will find and remove a coupon string from the coupons array.
     */
    removeCoupon: (couponCode: string) => this

    /**
     * This will sanitize, and add a product `Item` to the `.products` array.
     */
    addItem: (Item) => this

    /**
     * This will find, and remove a product `Item` from the `.products` array.
     */
    removeItem: (Item) => this

    /**
     * Will set the order time to be in the future. Very useful when testing but stores are closed, or when you want to order things in the future.
     */
    orderInFuture: (date: Date) => void

    /**
     * This will ensure an order is made now, and not in the future. If you had previously used `.orderInFuture`, its date will be removed.
     */
    orderNow: () => void

    /**
     * This will request dominos.com to validate the current `Order` instance.
     */
    validate: () => Promise<this>

    /**
     * This will request dominos.com to price the current `Order` instance.
     */
    price: () => Promise<this>

    /**
     * This will place the order with dominos.com using the current `Order` instance.
     */
    place: () => Promise<this>

    /**
     * Lacks information.
     */
    payload: string

    /**
     * This comes from `DominosFormat`, but the setter is overloaded for special Domino's `Order` format.
     */
    formatted: {}

    /**
     * Validation response Object from Domino's.
     */
    validationResponse: {}

    /**
     * Price response Object from Domino's.
     */
    priceResponse: {}

    /**
     * Place order response Object from Domino's
     */
    placeResponse: {}

    constructor(
      /**
       * This is a Domino's Customer instance.
       */
      customer: ICustomer,
    )
  }

  /**
   * Payment
   */

  type AmountType = number
  type TipAmountType = number
  type NumberType = string
  type ExpirationType = string
  type SecurityCodeType = string
  type PostalCodeType = string

  type PaymentType = 'CreditCard'
  type CardType = 'VISA' | 'MASTERCARD' | 'AMEX' | 'DINERS' | 'DISCOVER' | 'JCB' | 'ENROUTE'

  interface IPayment {
    /**
     * Amount to pay with the card.
     */
    amount?: AmountType

    /**
     * Amount of the payment that is a tip.
     */
    tipAmount?: TipAmountType

    /**
     * Credit card number sanitized when instantiatied per Domino's rules (numbers only).
     */
    number: NumberType

    /**
     * Credit card expiration sanitized when instantiatied per Domino's rules (numbers only).
     */
    expiration: ExpirationType

    /**
     * Credit card security code.
     */
    securityCode: SecurityCodeType

    /**
     * Credit card billing postal/zip code.
     */
    postalCode: PostalCodeType
  }

  declare class Payment implements IPayment {
    /**
     * Payment type.
     */
    public type: PaymentType

    /**
     *  Supported credit cards.
     */
    public cardType: CardType

    public amount: AmountType
    public tipAmount: TipAmountType
    public number: NumberType
    public expiration: ExpirationType
    public securityCode: SecurityCodeType
    public postalCode: PostalCodeType

    constructor({amount, tipAmount, number, expiration, securityCode, postalCode}: IPayment)
  }

  /**
   * Tracking
   */

  type PhoneType = string
  type StoreIDType = string | number
  type OrderKeyType = string

  declare class Tracking {
    /**
     * Fetches all trackable orders for a given phone number.
     */
    public byPhone: (phone: PhoneType) => Promise<this>

    /**
     * Implementation which fetches a SOAP response. This is still used in places like Canada.
     */
    public byPhoneClassic: (phone: PhoneType) => Promise<this>

    /**
     * Fetches a specific order's tracking info from a specific store.
     */
    public byId: (storeID: StoreIDType, orderKey: OrderKeyType) => Promise<this>

    /**
     * Fetches all orders for a specific URL query.
     */
    public byUrl: (url: URL) => Promise<this>
  }

  /**
   * Menu
   */

  type StoreIDType = number | string
  type LanguageType = string

  interface IMenu {
    /**
     * Categorized products.
     */
    categories: {
      coponsByProduct: unknown
      coupons: unknown
      food: unknown
      preconfiguredProduct: unknown
    }

    /**
     * Coupons details that can be used for discounts.
     */
    coupons: {
      /**
       * Lacks information.
       */
      products: {}

      /**
       * Lacks information.
       */
      shortCouponDescriptions: {}

      /**
       * Lacks information.
       */
      couponTiers: {}
    }

    /**
     * Types of flavors, and sauces for different foods.
     */
    flavors: {}

    /**
     * List of various products you can order. This does not include all of the same products from the `.categories` member sadly.
     */
    products: {}

    /**
     * Side dishes, and side orders.
     */
    sides: {}

    /**
     * Various order sizes, and price counts for products.
     */
    sizes: {}

    /**
     * Toppings that can be applied to various dishes and pizzas.
     */
    toppings: {}

    /**
     * Customized, or special versions of popular dishes.
     */
    variants: {}

    /**
     * Selection of preconfigured products to order.
     */
    preconfiguredProducts: {}

    /**
     * Strange Object which contains a seeminly random set of short description for just a few products.
     */
    shortProductDescriptions: {}

    /**
     * Unsupported products, and options.
     */

    unsupported: {
      /**
       * Lacks information.
       */
      products: {}

      /**
       * Lacks information.
       */
      options: {}
    }

    /**
     * Cooking instructions, and options.
     */
    cooking: {
      /**
       * Lacks information.
       */
      instructions: {}

      /**
       * Lacks information.
       */
      instructionGroups: {}
    }
  }

  declare class Menu implements IMenu {
    public menu: IMenu

    constructor(
      /**
       * Store ID.
       */
      storeID: StoreIDType,

      /**
       * Language.
       */
      lang?: LanguageType,
    )
  }

  /**
   * Store
   */

  type BasicStoreInfoType = {
    /**
     * Store ID.
     */
    StoreID: StoreIDType

    /**
     * Does it have delivery.
     */
    IsDeliveryStore: boolean

    /**
     * Minimum store distance.
     */
    MinDistance: number

    /**
     * Maximum store distance.
     */
    MaxDistance: number

    /**
     * Store phone number.
     */
    Phone: PhoneType

    /**
     * Store name.
     */
    StreetName: string

    /**
     * Store ciy.
     */
    City: string

    /**
     * Store region.
     */
    Region: string

    /**
     * Store postal code.
     */
    PostalCode: string

    /**
     * Address description.
     */
    AddressDescription: string

    /**
     * Holidays description.
     */
    HolidaysDescription: string

    /**
     * Hours description.
     */
    HoursDescription: string

    /**
     * Service hours description.
     */
    ServiceHoursDescription: {
      /**
       * Carryout description.
       */
      Carryout: string

      /**
       * Delivery description.
       */
      Delivery: string

      /**
       * DriveUpCarryout description.
       */
      DriveUpCarryout: string
    }

    /**
     * Can you order online.
     */
    IsOnlineCapable: boolean

    /**
     * Is it open.
     */
    IsOnlineNow: boolean

    /**
     * Lacks information.
     */
    IsNEONow: boolean

    /**
     * Spanish speaking.
     */
    IsSpanish: boolean

    /**
     * Location description.
     */
    LocationInfo: string

    /**
     * Language location description.
     */
    LanguageLocationInfo: {
      /**
       * Language location description in English.
       */
      en: string

      /**
       * Language location description in Spanish.
       */
      es: string
    }

    /**
     * Accepts delivery orders.
     */
    AllowDeliveryOrders: boolean

    /**
     * Accepts carryout orders.
     */
    AllowCarryoutOrders: boolean

    /**
     * Accepts drive up, and carryout orders.
     */
    AllowDuc: boolean

    /**
     * Wait time based on the delivery method.
     */
    ServiceMethodEstimatedWaitMinutes: {
      /**
       * Wait time for delivery.
       */
      Delivery: {
        /**
         * Minimum wait time in minutes.
         */
        Min: number

        /**
         * Maximum wait time in minutes.
         */
        Max: number
      }

      /**
       * Wait time for carryout.
       */
      Carryout: {
        /**
         * Minimum wait time in minutes.
         */
        Min: number

        /**
         * Maximum wait time in minutes.
         */
        Max: number
      }
    }

    /**
     * Store coordinates.
     */
    StoreCoordinates: {
      /**
       * Store latitude.
       */
      StoreLatitude: string

      /**
       * Store longitude.
       */
      StoreLongitude: string
    }

    /**
     * Accepts window pick up orders.
     */
    AllowPickupWindowOrders: boolean

    /**
     * Accepts contactless delivery.
     */
    ContactlessDelivery: string

    /**
     * Accepts contactless carryout.
     */
    ContactlessCarryout: string

    /**
     * Says if the store is open.
     */
    IsOpen: boolean

    /**
     * Says if a type of service is available.
     */
    ServiceIsOpen: {
      /**
       * Says if carryout is available.
       */
      Carryout: boolean

      /**
       * Says if delivery is available.
       */
      Delivery: boolean

      /**
       * Says if drive up, and carryout is available.
       */
      DriveUpCarryout: boolean
    }
  }

  declare class Store {
    /**
     * Parsed, and more friendly menu for the store.
     */
    public menu: IMenu

    /**
     * Additional store information.
     */
    public info: BasicStoreInfoType

    constructor(
      /**
       * Store ID.
       */
      storeID: StoreIDType,

      /**
       * Language.
       */
      lang?: LanguageType,
    )
  }

  /**
   * Image
   */

  type ProductCodeType = string
  type Base64ImageType = string

  declare class Image extends Base64File {
    /**
     * Base64 encoded Domino's image.
     */
    public base64Image: Base64ImageType

    constructor(
      /**
       * Product code from the menu.
       */
      productCode: ProductCodeType,
    )
  }

  /**
   * Urls
   */

  interface ICountryURLs {
    /**
     * Top domain for orders.
     */
    sourceUri: string

    /**
     * Store location.
     */
    location: {
      /**
       * Address by latitude, and longitude.
       */
      find: string
    }

    /**
     * Store information.
     */
    store: {
      /**
       * Store locator.
       */
      find: string

      /**
       * Store profile.
       */
      info: string

      /**
       * Store menu.
       */
      menu: string
    }

    /**
     * Order options.
     */
    order: {
      /**
       * Order options.
       */
      validate: string

      /**
       * Order validation.
       */
      price: string

      /**
       * Order pricing.
       */
      place: string
    }

    /**
     * Product images.
     */
    images: string

    /**
     *  Domino's tracker.
     */
    trackRoot: string

    /**
     * Specifies what to track, such as orders.
     */
    track: string

    /**
     *  Payment gateway.
     */
    token: string

    /**
     * General upsell.
     */
    upsell: string

    /**
     * Specific types of upsell.
     */
    stepUpsell: string
  }

  /**
   * Country URLs.
   */
  declare var urls: ICountryURLs
}

/**
 * Base64File
 */

type Agent = import('http').Agent

interface INodeFetchOptions {
  /**
   * HTTP request method like **GET**.
   */
  method?: string

  /**
   * Request headers.
   */
  headers?: {}

  /**
   * Request body.
   */
  body?: null | string | BufferSource | Blob | ReadableStream

  /**
   * Set to `manual` to extract redirect headers, `error` to reject redirect.
   */
  redirect?: 'error' | 'follow' | 'manual'

  /**
   * Pass an instance of AbortSignal to optionally abort requests.
   */
  signal?: AbortSignal | null

  /**
   * Maximum redirect count. 0 to not follow redirect.
   */
  follow?: number

  /**
   * Support gzip/deflate content encoding. `False` to disable.
   */
  compress?: boolean

  /**
   * Maximum response body size in bytes. 0 to disable.
   */
  size?: number

  /**
   * `http(s).Agent` instance or function that returns an instance.
   */
  agent?: Agent | ((parsedUrl: URL) => Agent)

  /**
   * Lacks information.
   */
  highWaterMark?: number

  /**
   * Lacks information.
   */
  insecureHTTPParser?: boolean
}

declare class Base64File {
  /**
   * Loads a local file and converts it to base64. Path should always end with a slash.
   */
  load: (path: string, fileName: string, callback: (err: Error, data: string) => void) => void

  /**
   * Same as load, but it returns the base64 string instead of passing it to a callback. This could be slow on really large files.
   */
  loadSync: (path: string, fileName: string) => void

  /**
   * Loads a remote file and converts it to base64. This defaults to a simple **GET** request, but allows the full options from `node-fetch` for any type of request even with payloads.
   */
  loadRemote: (url: string, fileName: string, options: INodeFetchOptions) => void

  /**
   * Saves the data to the specified path, and filename async callback.
   */
  save: (data: string, path: string, fileName: string, callback: (err: Error, data: string) => void) => void

  /**
   * Saves the data to the specified path, and filename sync.
   */
  saveSync: (data: string, path: string, fileName: string) => void
}

/**
 * Domino's Utils
 */

declare module 'dominos/utils/urls.js' {
  interface ICountryURLs {
    /**
     * Referer URL.
     */
    referer?: string

    /**
     * Top domain for orders.
     */
    sourceUri: string

    /**
     * Store location.
     */
    location: {
      /**
       * Address by latitude, and longitude.
       */
      find: string
    }

    /**
     * Store information.
     */
    store: {
      /**
       * Store locator.
       */
      find: string

      /**
       * Store profile.
       */
      info: string

      /**
       * Store menu.
       */
      menu: string
    }

    /**
     * Order options.
     */
    order: {
      /**
       * Order options.
       */
      validate: string

      /**
       * Order validation.
       */
      price: string

      /**
       * Order pricing.
       */
      place: string
    }

    /**
     * Tracking data.
     */
    track: string

    /**
     * Product images.
     */
    images?: string

    /**
     *  Domino's tracker.
     */
    trackRoot?: string

    /**
     * Specifies what to track, such as orders.
     */
    track?: string

    /**
     *  Payment gateway.
     */
    token?: string

    /**
     * General upsell.
     */
    upsell?: string

    /**
     * Specific types of upsell.
     */
    stepUpsell?: string
  }

  /**
   * Used to set the country.
   */
  function useInternational(internationalURLs: ICountryURLs)

  /**
   * Canada URL options
   */
  declare var canada: ICountryURLs

  /**
   * USA URL options
   */
  declare var usa: ICountryURLs
}
