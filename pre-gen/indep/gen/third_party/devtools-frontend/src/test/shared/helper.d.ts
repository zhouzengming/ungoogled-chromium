export { platform } from '../conductor/platform.js';
declare global {
    interface Window {
        __pendingEvents: Map<string, Event[]>;
        __eventHandlers: WeakMap<Element, Map<string, Promise<void>>>;
        __getRenderCoordinatorPendingFrames(): number;
    }
}
export declare const step: <T = unknown>(description: string, step: () => Promise<T> | T) => Promise<Awaited<T>>;
export declare function matchString(actual: string, expected: string | RegExp): true | string;
export declare function matchArray<A, E>(actual: A[], expected: E[], comparator: (actual: A, expected: E) => true | string): true | string;
export declare function matchTable<A, E>(actual: A[][], expected: E[][], comparator: (actual: A, expected: E) => true | string): string | true;
export declare const matchStringArray: (actual: string[], expected: Array<string | RegExp>) => string | true;
export declare const matchStringTable: (actual: string[][], expected: Array<Array<string | RegExp>>) => string | true;
export declare const replacePuppeteerUrl: (value: string) => string;
