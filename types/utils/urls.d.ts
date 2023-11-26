export namespace urls {
    let sourceUri: string;
    namespace location {
        let find: string;
    }
    namespace store {
        let find_1: string;
        export { find_1 as find };
        export let info: string;
        export let menu: string;
    }
    namespace order {
        let validate: string;
        let price: string;
        let place: string;
    }
    let images: string;
    let trackRoot: string;
    let track: string;
    let token: string;
    let upsell: string;
    let stepUpsell: string;
}
export namespace canada {
    let sourceUri_1: string;
    export { sourceUri_1 as sourceUri };
    export namespace location_1 {
        let find_2: string;
        export { find_2 as find };
    }
    export { location_1 as location };
    export namespace store_1 {
        let find_3: string;
        export { find_3 as find };
        let info_1: string;
        export { info_1 as info };
        let menu_1: string;
        export { menu_1 as menu };
    }
    export { store_1 as store };
    export namespace order_1 {
        let validate_1: string;
        export { validate_1 as validate };
        let price_1: string;
        export { price_1 as price };
        let place_1: string;
        export { place_1 as place };
    }
    export { order_1 as order };
    let images_1: string;
    export { images_1 as images };
    let track_1: string;
    export { track_1 as track };
    let token_1: string;
    export { token_1 as token };
    let upsell_1: string;
    export { upsell_1 as upsell };
    let stepUpsell_1: string;
    export { stepUpsell_1 as stepUpsell };
}
export namespace usa { }
export function useInternational(internationalURLs?: {
    sourceUri: string;
    location: {
        find: string;
    };
    store: {
        find: string;
        info: string;
        menu: string;
    };
    order: {
        validate: string;
        price: string;
        place: string;
    };
    images: string;
    trackRoot: string;
    track: string;
    token: string;
    upsell: string;
    stepUpsell: string;
}): void;
export { urls as default };
