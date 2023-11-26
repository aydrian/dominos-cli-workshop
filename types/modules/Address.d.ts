export class Address extends DominosFormat {
    constructor(parameters: any);
    street: string;
    streetNumber: string;
    streetName: string;
    unitType: string;
    unitNumber: string;
    city: string;
    region: string;
    postalCode: string;
    deliveryInstructions: string;
    get addressLines(): {
        line1: string;
        line2: string;
    };
    #private;
}
import DominosFormat from './DominosFormat.js';
export { Address as default };
