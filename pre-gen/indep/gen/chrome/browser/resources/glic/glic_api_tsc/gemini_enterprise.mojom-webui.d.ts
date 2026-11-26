import { mojo } from '//resources/mojo/mojo/public/js/bindings.js';
import { Url as url_mojom_Url } from '//resources/mojo/url/mojom/url.mojom-webui.js';
export declare const OpenSignInTabResultSpec: {
    $: mojo.internal.MojomType;
};
export declare enum OpenSignInTabResult {
    MIN_VALUE = 0,
    MAX_VALUE = 4,
    kUnknown = 0,
    kSuccess = 1,
    kErrorNoUrl = 2,
    kErrorDisallowedUrl = 3,
    kErrorFailure = 4
}
export declare const CloseSignInTabResultSpec: {
    $: mojo.internal.MojomType;
};
export declare enum CloseSignInTabResult {
    MIN_VALUE = 0,
    MAX_VALUE = 3,
    kUnknown = 0,
    kSuccess = 1,
    kAlreadyClosed = 2,
    kNoSignInTab = 3
}
export type GeminiEnterpriseHandlerPendingReceiverEndpoint = mojo.internal.interfaceSupport.Endpoint<GeminiEnterpriseHandlerPendingReceiver>;
export declare class GeminiEnterpriseHandlerPendingReceiver implements mojo.internal.interfaceSupport.PendingReceiver<GeminiEnterpriseHandler> {
    handle: mojo.internal.interfaceSupport.Endpoint<GeminiEnterpriseHandlerPendingReceiver>;
    constructor(handle: MojoHandle | GeminiEnterpriseHandlerPendingReceiverEndpoint);
    bindInBrowser(scope?: string): void;
}
export interface GeminiEnterpriseHandlerInterface {
    openSignInTab(options: (OpenSignInTabOptions | null)): Promise<{
        result: OpenSignInTabResult;
    }>;
    closeSignInTab(options: (CloseSignInTabOptions | null)): Promise<{
        result: CloseSignInTabResult;
    }>;
}
export declare class GeminiEnterpriseHandlerRemote implements GeminiEnterpriseHandlerInterface, mojo.internal.interfaceSupport.InterfaceRemote<GeminiEnterpriseHandlerPendingReceiver> {
    private proxy;
    $: mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper<GeminiEnterpriseHandlerPendingReceiver>;
    onConnectionError: mojo.internal.interfaceSupport.ConnectionErrorEventRouter;
    constructor(handle?: MojoHandle | GeminiEnterpriseHandlerPendingReceiverEndpoint);
    openSignInTab(options: (OpenSignInTabOptions | null)): Promise<{
        result: OpenSignInTabResult;
    }>;
    closeSignInTab(options: (CloseSignInTabOptions | null)): Promise<{
        result: CloseSignInTabResult;
    }>;
}
/**
 * An object which receives request messages for the GeminiEnterpriseHandler
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
export declare class GeminiEnterpriseHandlerReceiver implements mojo.internal.interfaceSupport.InterfaceReceiver<GeminiEnterpriseHandlerRemote, GeminiEnterpriseHandlerPendingReceiver> {
    private helper_internal_;
    $: mojo.internal.interfaceSupport.InterfaceReceiverHelper<GeminiEnterpriseHandlerRemote, GeminiEnterpriseHandlerPendingReceiver>;
    onConnectionError: mojo.internal.interfaceSupport.ConnectionErrorEventRouter;
    constructor(impl: GeminiEnterpriseHandlerInterface);
}
export declare class GeminiEnterpriseHandler {
    static get $interfaceName(): string;
    /**
     * Returns a remote for this interface which sends messages to the browser.
     * The browser must have an interface request binder registered for this
     * interface and accessible to the calling document's frame.
     */
    static getRemote(): GeminiEnterpriseHandlerRemote;
}
/**
 * An object which receives request messages for the GeminiEnterpriseHandler
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
export declare class GeminiEnterpriseHandlerCallbackRouter implements mojo.internal.interfaceSupport.InterfaceCallbackRouter<GeminiEnterpriseHandlerRemote, GeminiEnterpriseHandlerPendingReceiver> {
    private helper_internal_;
    $: mojo.internal.interfaceSupport.InterfaceReceiverHelper<GeminiEnterpriseHandlerRemote, GeminiEnterpriseHandlerPendingReceiver>;
    router_: mojo.internal.interfaceSupport.CallbackRouter;
    openSignInTab: mojo.internal.interfaceSupport.InterfaceCallbackReceiver<(options: (OpenSignInTabOptions | null)) => any>;
    closeSignInTab: mojo.internal.interfaceSupport.InterfaceCallbackReceiver<(options: (CloseSignInTabOptions | null)) => any>;
    onConnectionError: mojo.internal.interfaceSupport.ConnectionErrorEventRouter;
    constructor();
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id: number): boolean;
}
export declare const OpenSignInTabOptionsSpec: {
    $: mojo.internal.MojomType;
};
export declare const CloseSignInTabOptionsSpec: {
    $: mojo.internal.MojomType;
};
export declare const GeminiEnterpriseHandler_OpenSignInTab_ParamsSpec: {
    $: mojo.internal.MojomType;
};
export declare const GeminiEnterpriseHandler_OpenSignInTab_ResponseParamsSpec: {
    $: mojo.internal.MojomType;
};
export declare const GeminiEnterpriseHandler_CloseSignInTab_ParamsSpec: {
    $: mojo.internal.MojomType;
};
export declare const GeminiEnterpriseHandler_CloseSignInTab_ResponseParamsSpec: {
    $: mojo.internal.MojomType;
};
export declare interface OpenSignInTabOptionsMojoType {
    signinUrl: (url_mojom_Url | null);
}
export type OpenSignInTabOptions = OpenSignInTabOptionsMojoType;
export declare interface CloseSignInTabOptionsMojoType {
}
export type CloseSignInTabOptions = CloseSignInTabOptionsMojoType;
export declare interface GeminiEnterpriseHandler_OpenSignInTab_ParamsMojoType {
    options: (OpenSignInTabOptions | null);
}
export type GeminiEnterpriseHandler_OpenSignInTab_Params = GeminiEnterpriseHandler_OpenSignInTab_ParamsMojoType;
export declare interface GeminiEnterpriseHandler_OpenSignInTab_ResponseParamsMojoType {
    result: OpenSignInTabResult;
}
export type GeminiEnterpriseHandler_OpenSignInTab_ResponseParams = GeminiEnterpriseHandler_OpenSignInTab_ResponseParamsMojoType;
export declare interface GeminiEnterpriseHandler_CloseSignInTab_ParamsMojoType {
    options: (CloseSignInTabOptions | null);
}
export type GeminiEnterpriseHandler_CloseSignInTab_Params = GeminiEnterpriseHandler_CloseSignInTab_ParamsMojoType;
export declare interface GeminiEnterpriseHandler_CloseSignInTab_ResponseParamsMojoType {
    result: CloseSignInTabResult;
}
export type GeminiEnterpriseHandler_CloseSignInTab_ResponseParams = GeminiEnterpriseHandler_CloseSignInTab_ResponseParamsMojoType;
