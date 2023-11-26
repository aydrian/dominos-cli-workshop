export class AmountsBreakdown extends DominosFormat {
    constructor(params: any);
    foodAndBeverage: string;
    adjustment: string;
    surcharge: string;
    deliveryFee: string;
    tax: number;
    tax1: number;
    tax2: number;
    tax3: number;
    tax4: number;
    tax5: number;
    bottle: number;
    customer: number;
    roundingAdjustment: number;
    cash: number;
    savings: string;
}
import DominosFormat from "./DominosFormat.js";
export { AmountsBreakdown as default };
