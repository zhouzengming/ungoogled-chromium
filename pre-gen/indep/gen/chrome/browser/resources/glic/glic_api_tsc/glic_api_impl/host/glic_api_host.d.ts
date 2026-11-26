import { WebClientHandlerRemote } from '../../glic.mojom-webui.js';
import type { WebClientInitialState } from '../../glic.mojom-webui.js';
import { ClientCapabilities } from '../../glic_api/glic_api.js';
import type { ObservableValueReadOnly } from '../../observable.js';
import { TaskQueue } from '../../task_queue.js';
import type { WebClient } from '../request_types.js';
import type { ResponseExtras } from '../transport/messaging.js';
import type { //
InterfaceDef, //
PostMessageLifecycleObserver, //
PostMessageRemote, //
PostMessageRouter } from '../transport/post_message_transport.js';
import { HostMessageHandler } from './host_from_client.js';
import { PanelOpenState } from './types.js';
export declare enum WebClientState {
    UNINITIALIZED = 0,
    WARMED = 1,
    RESPONSIVE = 2,
    UNRESPONSIVE = 3,
    ERROR = 4
}
type HandlerFunction = (payload: unknown, extras: ResponseExtras) => Promise<unknown>;
/**
 * The host side of the Glic API.
 *
 * Its primary job is to route calls between the client (over postMessage) and
 * the browser (over Mojo).
 */
export declare class GlicApiHost implements PostMessageLifecycleObserver {
    hostMessageHandler: HostMessageHandler;
    sender: PostMessageRemote<WebClient>;
    panelIsActive: boolean;
    readonly handler: WebClientHandlerRemote;
    get handlerForTesting(): WebClientHandlerRemote;
    private webClientState;
    openCloseTasks: TaskQueue;
    private waitingOnPanelWillOpenValue;
    private clientActiveObs;
    private panelOpenState;
    private instanceIsActive;
    readonly router: PostMessageRouter;
    private isDestroyed;
    constructor(hostRemote: PostMessageRemote<WebClient>, hostRouter: PostMessageRouter);
    destroy(): void;
    setInitialState(initialState: WebClientInitialState, clientCapabilities: Set<ClientCapabilities>): void;
    waitingOnPanelWillOpen(): boolean;
    setWaitingOnPanelWillOpen(value: boolean): void;
    panelOpenStateChanged(state: PanelOpenState): void;
    setInstanceIsActive(instanceIsActive: boolean): void;
    getInstanceIsActive(): boolean;
    isPanelOpen(): boolean;
    private isClientActive;
    webClientInitialized(): void;
    webClientInitializeFailed(): void;
    setWebClientState(state: WebClientState): void;
    getWebClientState(): ObservableValueReadOnly<WebClientState>;
    openLinkInPopup(url: string, initialWidth: number, initialHeight: number): void;
    openLinkInNewTab(url: string): Promise<void>;
    handlerWrapper(type: string, interfaceDef: InterfaceDef | undefined, payload: unknown, extras: ResponseExtras, handlerFunction: HandlerFunction): Promise<unknown>;
    onRequestReceived(type: string, interfaceDef: InterfaceDef | undefined): void;
    onRequestHandlerException(type: string, interfaceDef: InterfaceDef | undefined): void;
    onRequestCompleted(type: string, interfaceDef: InterfaceDef | undefined): void;
    reportRequestCountEvent(requestType: string, interfaceDef: InterfaceDef | undefined, event: GlicRequestEvent): void;
    reportLatency(requestType: string, interfaceDef: InterfaceDef | undefined, latencyMs: number): void;
}
declare enum GlicRequestEvent {
    REQUEST_RECEIVED = 0,
    RESPONSE_SENT = 1,
    REQUEST_HANDLER_EXCEPTION = 2,
    REQUEST_RECEIVED_WHILE_INACTIVE = 4,
    MAX_VALUE = 4
}
export {};
