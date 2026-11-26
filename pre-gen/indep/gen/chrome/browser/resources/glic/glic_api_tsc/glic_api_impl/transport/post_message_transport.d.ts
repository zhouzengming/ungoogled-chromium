import type { InterfaceDef, InterfaceDefMethods, RequestPayload, ResponsePayload } from './messaging.js';
import { ResponseExtras } from './messaging.js';
export type { InterfaceDef, InterfaceDefMethods, RequestPayload, ResponsePayload, };
export interface PostMessageReceiver {
    close(): void;
    setMessageHandler<I extends InterfaceDef>(handler: PostMessageHandler<I>, interfaceDef?: I): void;
    addCloseHandler(f: () => void): void;
}
export interface PostMessageRemote<I extends InterfaceDef> {
    close(): void;
    addCloseHandler(f: () => void): void;
    requestWithResponse<T extends keyof InterfaceDefMethods<I>>(requestType: T, request: RequestPayload<InterfaceDefMethods<I>, T>, transfer?: Transferable[]): Promise<ResponsePayload<InterfaceDefMethods<I>, T>>;
    requestNoResponse<T extends keyof InterfaceDefMethods<I>>(requestType: T, request: RequestPayload<InterfaceDefMethods<I>, T>, transfer?: Transferable[]): void;
    rawSender(): PostMessageRequestSender;
}
export interface TransferableException {
    exception: Error;
    [key: string]: unknown;
}
export interface ErrorCodec {
    serialize(e: Error): TransferableException;
    deserialize(raw: TransferableException): Error;
}
declare const brand: unique symbol;
export type PendingReceiver<I extends InterfaceDef> = number & {
    [brand]: {
        receiver: I;
    };
};
export type PendingRemote<I extends InterfaceDef> = number & {
    [brand]: {
        remote: I;
    };
};
declare const rootPipeBrand: unique symbol;
type RootPipe = number & {
    [rootPipeBrand]: true;
};
export interface PostMessageRouter {
    receiver?: PostMessageRequestReceiver;
    newPipeWithRemote<RemoteInterface extends InterfaceDef>(remoteInterfaceDef: RemoteInterface): {
        receiver: PendingReceiver<RemoteInterface>;
        remote: PostMessageRemote<RemoteInterface>;
    };
    newPipeWithReceiver<ReceiverInterface extends InterfaceDef>(receiverHandler: PostMessageHandler<ReceiverInterface>, interfaceDef: ReceiverInterface): {
        receiver: PostMessageReceiver;
        remote: PendingRemote<ReceiverInterface>;
    };
    newRemote<I extends InterfaceDef>(remote: PendingRemote<I> | RootPipe): PostMessageRemote<I>;
    newReceiver<I extends InterfaceDef>(receiver: PendingReceiver<I>, handler: PostMessageHandler<I>, interfaceDef: I): PostMessageReceiver;
    destroy(): void;
    addCloseHandler(pipeId: PendingRemote<InterfaceDef> | PendingReceiver<InterfaceDef>, handler: () => void): void;
}
export declare const ON_PIPE_CLOSED: unique symbol;
declare interface MessageBase {
    senderId: string;
    type: string;
    pipeId: number;
}
export declare interface RequestMessage extends MessageBase {
    glicRequest: true;
    requestId?: number;
    requestPayload: unknown;
}
declare interface ResponseMessage extends MessageBase {
    responseId: number;
    responsePayload?: unknown;
    exception?: TransferableException;
}
export declare interface PostMessageSender {
    postMessage(message: unknown, targetOrigin: string, transfer?: Transferable[]): void;
}
export declare class Queue<T> {
    next: T[];
    current: Array<T | undefined>;
    index: number;
    push(item: T): void;
    popFront(): T | undefined;
    get length(): number;
    empty(): boolean;
}
interface PipeInterface {
    readonly open: boolean;
    readonly messageHandler: unknown;
    interfaceDef?: InterfaceDef;
    addCloseHandler(f: () => void): void;
    close(): void;
    setMessageHandler(handler: unknown, interfaceDef?: InterfaceDef): void;
    pending(): boolean;
    pushPendingMessage(pmReceiver: PostMessageRequestReceiver, requestMessage: RequestMessage): void;
    getHandlerFunction(type: string): HandlerFunction | undefined;
}
export declare class PostMessageRouterImpl implements PostMessageRouter {
    readonly remoteOrigin: string;
    readonly senderId: string;
    readonly messageSender: PostMessageSender;
    readonly isHost: boolean;
    readonly errorCodec: ErrorCodec;
    private onDestroy;
    sender?: PostMessageRequestSender;
    receiver?: PostMessageRequestReceiver;
    readonly pipes: Map<number, PipeInterface>;
    readonly closedPipes: InverseSet;
    private nextPipeId;
    readonly loggingPrefix: string;
    constructor(remoteOrigin: string, senderId: string, messageSender: PostMessageSender, logPrefix: string, isHost: boolean, errorCodec?: ErrorCodec);
    destroy(): void;
    onMessage(event: MessageEvent): void;
    sendRequest(pipeId: number, type: string, requestId: number | undefined, requestPayload: unknown, transfer?: Transferable[]): void;
    sendResponse(pipeId: number, type: string, senderId: string, responseId: number, responsePayload: unknown, exception: TransferableException | undefined, transfer?: Transferable[]): void;
    newPipe<I extends InterfaceDef>(): {
        receiver: PendingReceiver<I>;
        remote: PendingRemote<I>;
    };
    newPipeWithReceiver<ReceiverInterface extends InterfaceDef>(receiverHandler: PostMessageHandler<ReceiverInterface>, interfaceDef: ReceiverInterface): {
        receiver: PostMessageReceiver;
        remote: PendingRemote<ReceiverInterface>;
    };
    newPipeWithRemote<RemoteInterface extends InterfaceDef>(_remoteInterfaceDef: RemoteInterface): {
        receiver: PendingReceiver<RemoteInterface>;
        remote: PostMessageRemote<RemoteInterface>;
    };
    newReceiver<I extends InterfaceDef>(receiver: PendingReceiver<I> | RootPipe, handler: PostMessageHandler<I>, interfaceDef: I): PostMessageReceiver;
    newRemote<I extends InterfaceDef>(remote: PendingRemote<I> | RootPipe): PostMessageRemote<I>;
    closePipe(pipe: PendingReceiver<InterfaceDef> | PendingRemote<InterfaceDef> | number): void;
    remoteClosedPipe(pipeId: number): void;
    getOrMakePipe(id: number): PipeInterface;
    addCloseHandler(pipeId: PendingRemote<InterfaceDef> | PendingReceiver<InterfaceDef>, handler: () => void): void;
}
export type PostMessageHandler<I extends InterfaceDef> = {
    [Property in keyof InterfaceDefMethods<I>]: (payload: RequestPayload<InterfaceDefMethods<I>, Property>, extras: ResponseExtras) => Promise<ResponsePayload<InterfaceDefMethods<I>, Property>> | ResponsePayload<InterfaceDefMethods<I>, Property>;
} & {
    [ON_PIPE_CLOSED]?: () => void;
};
export declare class PostMessageRemoteImpl<I extends InterfaceDef> implements PostMessageRemote<I> {
    readonly pipeId: PendingRemote<I> | RootPipe;
    sender: PostMessageRequestSender;
    private router;
    constructor(pipeId: PendingRemote<I> | RootPipe, sender: PostMessageRequestSender, router: PostMessageRouterImpl);
    addCloseHandler(f: () => void): void;
    close(): void;
    requestWithResponse<T extends keyof InterfaceDefMethods<I>>(requestType: T, request: RequestPayload<InterfaceDefMethods<I>, T>, transfer?: Transferable[]): Promise<ResponsePayload<InterfaceDefMethods<I>, T>>;
    requestNoResponse<T extends keyof InterfaceDefMethods<I>>(requestType: T, request: RequestPayload<InterfaceDefMethods<I>, T>, transfer?: Transferable[]): void;
    rawSender(): PostMessageRequestSender;
}
/**
 * Receives messages sent via a `PostMessageRemote`, and forwards them to a
 * message handler.
 */
export declare class PostMessageReceiverImpl implements PostMessageReceiver {
    readonly pipe: PipeInterface;
    readonly pipeId: number;
    handler: PostMessageHandler<InterfaceDef> | undefined;
    private router;
    constructor(pipe: PipeInterface, pipeId: number, handler: PostMessageHandler<InterfaceDef> | undefined, router: PostMessageRouterImpl);
    close(): void;
    setMessageHandler<I extends InterfaceDef>(handler: PostMessageHandler<I>, interfaceDef: I): void;
    addCloseHandler(f: () => void): void;
}
export declare class PostMessageRequestSender {
    private router;
    requestId: number;
    responseHandlers: Map<number, {
        type: string;
        handler: (response: ResponseMessage) => void;
    }>;
    private maxInFlightRequests;
    sendResponsesForAllRequests: boolean;
    sendQueue: Queue<() => void>;
    queueNoticeLogged: boolean;
    constructor(router: PostMessageRouterImpl);
    inFlightRequestCount(): number;
    messageQueueLength(): number;
    onMessage(response: ResponseMessage): void;
    requestWithResponse(pipeId: number, requestType: string, request: unknown, transfer?: Transferable[]): Promise<unknown>;
    requestNoResponse(pipeId: number, requestType: string, request: unknown, transfer?: Transferable[]): void;
    setMaxInFlightRequests(maxInFlightRequests: number): void;
    private isQueueing;
}
/** Observer for postMessage request lifecycle events. */
export interface PostMessageLifecycleObserver {
    /**
     * Called when each request is received. Messages received on closed pipes do
     * not trigger this. Messages sent to pending pipes trigger this only after
     * the receiver is created.
     */
    onRequestReceived?(type: string, interfaceDef: InterfaceDef | undefined): void;
    /** Called when a request handler throws an exception. */
    onRequestHandlerException?(type: string, interfaceDef: InterfaceDef | undefined): void;
    /**
     * Called when a request response is sent (will not be called if
     * `onRequestHandlerException()` is called.).
     */
    onRequestCompleted?(type: string, interfaceDef: InterfaceDef | undefined): void;
}
type HandlerFunction = (payload: unknown, extras: ResponseExtras) => Promise<unknown>;
type HandlerWrapper = (type: string, interfaceDef: InterfaceDef | undefined, payload: unknown, extras: ResponseExtras, handler: HandlerFunction) => Promise<unknown>;
export declare class PostMessageRequestReceiver {
    private router;
    requestObserver: PostMessageLifecycleObserver;
    private handlerWrapper;
    constructor(router: PostMessageRouterImpl, requestObserver: PostMessageLifecycleObserver);
    setHandlerWrapper(wrapper: HandlerWrapper): void;
    onMessage(requestMessage: RequestMessage): Promise<void>;
}
export declare function createDirectMessagingPair<HostRemoteInterface extends InterfaceDef, ClientRemoteInterface extends InterfaceDef>(logPrefix: string, errorCodec: ErrorCodec, clientRootHandler: PostMessageHandler<ClientRemoteInterface>, hostRootHandler: PostMessageHandler<HostRemoteInterface>, clientInterfaceDef: ClientRemoteInterface, hostInterfaceDef: HostRemoteInterface, clientLifecycleObserver?: PostMessageLifecycleObserver, hostLifecycleObserver?: PostMessageLifecycleObserver): {
    client: {
        router: PostMessageRouterImpl;
        sender: PostMessageRequestSender;
        receiver: PostMessageRequestReceiver;
        rootRemote: PostMessageRemoteImpl<HostRemoteInterface>;
        rootReceiver: PostMessageReceiver;
    };
    host: {
        router: PostMessageRouterImpl;
        sender: PostMessageRequestSender;
        receiver: PostMessageRequestReceiver;
        rootRemote: PostMessageRemoteImpl<ClientRemoteInterface>;
        rootReceiver: PostMessageReceiver;
    };
};
export declare class InverseSet {
    private notContained;
    private maxValue;
    add(v: number): void;
    delete(v: number): void;
    has(v: number): boolean;
}
