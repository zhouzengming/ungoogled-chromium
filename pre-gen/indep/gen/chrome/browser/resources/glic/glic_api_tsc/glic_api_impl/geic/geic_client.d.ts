import type { WebClientHandlerRemote, WebClientInitialState } from '../../glic.mojom-webui.js';
import type { //
CloseSignInTabOptions, //
CloseSignInTabResult, //
GeicBrowserHost, //
OpenSignInTabOptions, //
OpenSignInTabResult } from '../../glic_api/glic_api.js';
export declare class GlicBrowserHostGeic implements GeicBrowserHost {
    private handler?;
    private handlerRemote?;
    initialize(_initialState: WebClientInitialState, handler?: WebClientHandlerRemote): void;
    destroy(): void;
    openSignInTab(options?: OpenSignInTabOptions): Promise<OpenSignInTabResult>;
    closeSignInTab(options?: CloseSignInTabOptions): Promise<CloseSignInTabResult>;
    private getGeicHandler;
}
