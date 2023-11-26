export class Menu {
    constructor(storeID: any, lang?: string);
    menu: {
        categories: {};
        coupons: {
            products: {};
            shortCouponDescriptions: {};
            couponTiers: {};
        };
        flavors: {};
        products: {};
        sides: {};
        sizes: {};
        toppings: {};
        variants: {};
        preconfiguredProducts: {};
        shortProductDescriptions: {};
        unsupported: {
            products: {};
            options: {};
        };
        cooking: {
            instructions: {};
            instructionGroups: {};
        };
    };
    set dominosAPIResponse(arg: {});
    get dominosAPIResponse(): {};
    #private;
}
export { Menu as default };
