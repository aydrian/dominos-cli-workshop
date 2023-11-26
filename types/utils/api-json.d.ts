declare namespace old {
    export { get };
    export { getTracking };
    export { post };
}
export function get(url: any): Promise<any>;
export function getTracking(url: any, market?: string): Promise<any>;
export function post(url: any, payload: any): Promise<any>;
export { old as default };
