export class Payment extends DominosFormat {
    constructor(parameters: any);
    number: string;
    expiration: string;
    securityCode: string;
    postalCode: string;
    amount: number;
    tipAmount: number;
    type: string;
    cardType: string;
    #private;
}
import DominosFormat from './DominosFormat.js';
export { Payment as default };
