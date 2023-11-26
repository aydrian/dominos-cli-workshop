export class NearbyStores {
    constructor(addressInfo?: Address, pickUpType?: string);
    address: Address;
    stores: any[];
    set dominosAPIResponse(arg: {});
    get dominosAPIResponse(): {};
    #private;
}
import Address from '../modules/Address.js';
export { NearbyStores as default };
