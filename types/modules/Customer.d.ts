export class Customer extends DominosFormat {
    constructor(parameters: any);
    address: Address;
    phone: string;
    firstName: string;
    lastName: string;
    email: string;
    phonePrefix: string;
}
import DominosFormat from './DominosFormat.js';
import Address from './Address.js';
export { Customer as default };
