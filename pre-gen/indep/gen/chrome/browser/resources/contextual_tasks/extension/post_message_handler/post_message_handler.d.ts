import type { ExtensionBrowserProxy } from 'chrome://contextual-tasks/contextual_tasks_browser_proxy.js';
export declare function urlMatchesAllowList(origin: string): boolean;
export declare class ExtensionPostMessageHandler {
    private browserProxy_;
    private targetOrigin_;
    private pendingSearchMessages_;
    private handshakeIntervalId_;
    private handshakeCompleted_;
    private messageListener_;
    private onHandshakeCompleteListenerId_;
    private postAimMessageListenerId_;
    private postSearchMessageListenerId_;
    private isDestroyed_;
    constructor(browserProxy?: ExtensionBrowserProxy);
    get targetOrigin(): string | null;
    get handshakeCompleted(): boolean;
    get isDestroyed(): boolean;
    private setTargetOrigin_;
    setTargetOriginForTesting(origin: string | null): void;
    initHandshake(): Promise<void>;
    private initWindowListener_;
    private initMojoListeners_;
    destroy(): void;
}
export declare function initExtensionPostMessaging(browserProxy?: ExtensionBrowserProxy): ExtensionPostMessageHandler;
export declare function resetExtensionPostMessagingForTesting(): void;
