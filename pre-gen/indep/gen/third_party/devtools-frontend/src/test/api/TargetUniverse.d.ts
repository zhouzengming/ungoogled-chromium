import type * as puppeteer from 'puppeteer-core';
import type * as SDK from '../../front_end/core/sdk/sdk.js';
import type * as Foundation from '../../front_end/foundation/foundation.js';
export interface TargetUniverse {
    /** The DevTools target corresponding to the puppeteer Page */
    target: SDK.Target.Target;
    universe: Foundation.Universe.Universe;
    /** The secondary session created for this page */
    session: puppeteer.CDPSession;
    cleanup: () => void;
}
export declare function createTargetUniverse(session: puppeteer.CDPSession, options?: Partial<Foundation.Universe.CreationOptions>): Promise<TargetUniverse>;
