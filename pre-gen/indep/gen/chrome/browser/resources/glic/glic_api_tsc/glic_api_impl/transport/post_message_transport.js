// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { assert } from '//resources/js/assert.js';
import { ResponseExtras } from './messaging.js';
const ROOT_PIPE = 0;
export const ON_PIPE_CLOSED = Symbol('ON_PIPE_CLOSED');
function newSenderId() {
    const array = new Uint8Array(8);
    crypto.getRandomValues(array);
    return Array.from(array).map((n) => n.toString(16)).join('');
}
// Implements a simple queue with O(1) push and shift.
export class Queue {
    // An array where elements are always pushed.
    next = [];
    // An array frozen in size from which elements are consumed.
    // When all elements are consumed, `next` is swapped into `current`.
    current = [];
    // Next element index in `current`.
    index = 0;
    push(item) {
        this.next.push(item);
    }
    popFront() {
        if (this.index < this.current.length) {
            const result = this.current[this.index];
            this.current[this.index] = undefined;
            this.index++;
            return result;
        }
        if (this.next.length === 0) {
            return undefined;
        }
        this.current = this.next;
        this.next = [];
        this.index = 0;
        return this.popFront();
    }
    get length() {
        return this.current.length - this.index + this.next.length;
    }
    empty() {
        return this.next.length === 0 && this.index === this.current.length;
    }
}
class ClosedPipe {
    open = false;
    messageHandler = undefined;
    interfaceDef = undefined;
    addCloseHandler(f) {
        f();
    }
    close() { }
    setMessageHandler(_handler, _interfaceDef) { }
    getHandlerFunction(_type) {
        return undefined;
    }
    pending() {
        return false;
    }
    pushPendingMessage(_pmReceiver, _requestMessage) { }
}
const CLOSED_PIPE = new ClosedPipe();
// Used by PostMessageRouterImpl to track a pipe.
class Pipe {
    id;
    onCloseHandlers = [];
    open = true;
    // The message handler for this pipe, if the pipe is bound as a receiver.
    messageHandler;
    interfaceDef;
    pendingMessages = [];
    constructor(
    // The id of the pipe, which is a unique number.
    id) {
        this.id = id;
    }
    close() {
        if (!this.open) {
            return;
        }
        this.open = false;
        this.onCloseHandlers.forEach((f) => {
            try {
                f();
            }
            catch (e) {
                console.error('Error in pipe onClose callback', e);
            }
        });
        this.onCloseHandlers = [];
        this.pendingMessages = [];
    }
    addCloseHandler(f) {
        if (this.open) {
            this.onCloseHandlers.push(f);
        }
        else {
            f();
        }
    }
    setMessageHandler(handler, interfaceDef) {
        this.messageHandler = handler;
        this.interfaceDef = interfaceDef;
        if (this.messageHandler && this.pendingMessages.length) {
            const messages = this.pendingMessages;
            this.pendingMessages = [];
            if (!this.open) {
                return;
            }
            setTimeout(() => {
                messages.forEach(([pmReceiver, requestMessage]) => {
                    pmReceiver.onMessage(requestMessage);
                });
            }, 0);
        }
    }
    getHandlerFunction(type) {
        if (!this.open) {
            return undefined;
        }
        if (this.messageHandler) {
            const handleFn = this.messageHandler[type];
            if (typeof handleFn !== 'function') {
                return undefined;
            }
            return handleFn.bind(this.messageHandler);
        }
        return undefined;
    }
    pending() {
        return this.open &&
            (!this.messageHandler || this.pendingMessages.length > 0);
    }
    pushPendingMessage(pmReceiver, requestMessage) {
        this.pendingMessages.push([pmReceiver, requestMessage]);
    }
}
export class PostMessageRouterImpl {
    remoteOrigin;
    senderId;
    messageSender;
    isHost;
    errorCodec;
    onDestroy;
    sender;
    receiver;
    // Pipes that are not closed.
    pipes = new Map();
    // Tracks IDs of pipes that have been closed.
    closedPipes = new InverseSet();
    nextPipeId;
    loggingPrefix;
    constructor(remoteOrigin, senderId, messageSender, logPrefix, isHost, errorCodec = {
        serialize: e => ({ exception: e }),
        deserialize: raw => raw.exception,
    }) {
        this.remoteOrigin = remoteOrigin;
        this.senderId = senderId;
        this.messageSender = messageSender;
        this.isHost = isHost;
        this.errorCodec = errorCodec;
        this.loggingPrefix = `${logPrefix}(${senderId.substring(0, 6)})`;
        // Use even and odd scheme to ensure host and client pipe ids don't clash.
        this.nextPipeId = isHost ? 2 : 1;
        const handler = this.onMessage.bind(this);
        window.addEventListener('message', handler);
        this.onDestroy = () => {
            window.removeEventListener('message', handler);
        };
    }
    destroy() {
        this.onDestroy();
    }
    onMessage(event) {
        if (event.origin !== this.remoteOrigin) {
            return;
        }
        // Check properties on MessageBase.
        const data = event.data;
        if (data.type === undefined || data.senderId === undefined ||
            !event.source) {
            return;
        }
        if (data.responseId === undefined) {
            // For RequestMessage, only process messages if they are not from this
            // sender.
            if (this.receiver && data.senderId !== this.senderId &&
                data.glicRequest === true) {
                this.receiver?.onMessage(data);
            }
        }
        else {
            // For ResponseMessage, only process messages if they are from this
            // sender.
            if (this.sender && data.senderId === this.senderId) {
                this.sender?.onMessage(data);
            }
        }
    }
    sendRequest(pipeId, type, requestId, requestPayload, transfer = []) {
        const request = {
            glicRequest: true,
            pipeId,
            type,
            requestId,
            requestPayload,
            senderId: this.senderId,
        };
        this.messageSender.postMessage(request, this.remoteOrigin, transfer);
    }
    sendResponse(pipeId, type, senderId, responseId, responsePayload, exception, transfer = []) {
        const response = {
            pipeId,
            type,
            responseId,
            responsePayload,
            senderId,
        };
        if (exception) {
            response.exception = exception;
        }
        this.messageSender.postMessage(response, this.remoteOrigin, transfer);
    }
    newPipe() {
        const id = this.nextPipeId;
        this.nextPipeId += 2;
        return {
            receiver: id,
            remote: id,
        };
    }
    newPipeWithReceiver(receiverHandler, interfaceDef) {
        const { receiver, remote } = this.newPipe();
        return {
            receiver: this.newReceiver(receiver, receiverHandler, interfaceDef),
            remote,
        };
    }
    newPipeWithRemote(_remoteInterfaceDef) {
        const { receiver, remote } = this.newPipe();
        return {
            receiver,
            remote: this.newRemote(remote),
        };
    }
    newReceiver(receiver, handler, interfaceDef) {
        const pipe = this.getOrMakePipe(receiver);
        if (pipe.open && handler) {
            pipe.setMessageHandler(handler, interfaceDef);
        }
        return new PostMessageReceiverImpl(pipe, receiver, handler, this);
    }
    newRemote(remote) {
        this.getOrMakePipe(remote);
        return new PostMessageRemoteImpl(remote, this.sender, this);
    }
    closePipe(pipe) {
        this.closedPipes.add(pipe);
        const existing = this.pipes.get(pipe);
        if (!existing) {
            return;
        }
        this.pipes.delete(pipe);
        existing.close();
        this.sendRequest(pipe, '__closePipe', undefined, undefined);
    }
    remoteClosedPipe(pipeId) {
        this.closedPipes.add(pipeId);
        const pipe = this.pipes.get(pipeId);
        if (pipe) {
            pipe.close();
            this.pipes.delete(pipeId);
        }
    }
    getOrMakePipe(id) {
        if (this.closedPipes.has(id)) {
            return CLOSED_PIPE;
        }
        let pipe = this.pipes.get(id);
        if (!pipe) {
            pipe = new Pipe(id);
            this.pipes.set(id, pipe);
        }
        return pipe;
    }
    addCloseHandler(pipeId, handler) {
        this.getOrMakePipe(pipeId).addCloseHandler(handler);
    }
}
export class PostMessageRemoteImpl {
    pipeId;
    sender;
    router;
    constructor(pipeId, sender, router) {
        this.pipeId = pipeId;
        this.sender = sender;
        this.router = router;
    }
    addCloseHandler(f) {
        const pipe = this.router.pipes.get(this.pipeId);
        pipe?.addCloseHandler(f);
    }
    close() {
        this.router.closePipe(this.pipeId);
    }
    requestWithResponse(requestType, request, transfer = []) {
        return this.sender.requestWithResponse(this.pipeId, requestType, request, transfer);
    }
    requestNoResponse(requestType, request, transfer = []) {
        this.sender.requestNoResponse(this.pipeId, requestType, request, transfer);
    }
    rawSender() {
        return this.sender;
    }
}
/**
 * Receives messages sent via a `PostMessageRemote`, and forwards them to a
 * message handler.
 */
export class PostMessageReceiverImpl {
    pipe;
    pipeId;
    handler;
    router;
    constructor(pipe, pipeId, handler, router) {
        this.pipe = pipe;
        this.pipeId = pipeId;
        this.handler = handler;
        this.router = router;
        this.pipe.addCloseHandler(() => {
            this.handler?.[ON_PIPE_CLOSED]?.();
        });
    }
    close() {
        this.router.closePipe(this.pipeId);
    }
    setMessageHandler(handler, interfaceDef) {
        this.pipe.setMessageHandler(handler, interfaceDef);
    }
    addCloseHandler(f) {
        this.pipe.addCloseHandler(f);
    }
}
// Sends requests over postMessage.
export class PostMessageRequestSender {
    router;
    requestId = 1;
    responseHandlers = new Map();
    // We limit the number of in-flight requests because it fails in a better way
    // than doing no limiting. The WebUI code heavily relies on promises to
    // dispatch work in processing mojo requests and requests over postMessage.
    // Ideally, we could prioritize processing of mojo requests, but that's not
    // currently tractable. Instead, we limit the number of in-flight requests
    // which in practice prevents the situation where the WebUI is too busy
    // processing new postMessage requests to respond to existing ones.
    maxInFlightRequests = Infinity;
    // If true, send responses for all requests even if the request doesn't
    // require one. This ensures in-flight request tracking is accurate.
    // Without this, in-flight request tracking just ignores requests that don't
    // require a response until after the `maxInFlightRequests` limit is reached.
    sendResponsesForAllRequests = false;
    sendQueue = new Queue();
    queueNoticeLogged = false;
    constructor(router) {
        this.router = router;
        assert(router.sender === undefined);
        router.sender = this;
    }
    inFlightRequestCount() {
        return this.responseHandlers.size;
    }
    messageQueueLength() {
        return this.sendQueue.length;
    }
    // Handles responses from the host.
    onMessage(response) {
        const entry = this.responseHandlers.get(response.responseId);
        if (!entry) {
            // No handler for this request.
            return;
        }
        this.responseHandlers.delete(response.responseId);
        if (!this.sendQueue.empty() &&
            this.responseHandlers.size < this.maxInFlightRequests) {
            // Running a queued send will always register another response handler.
            // This should ensure a steady state of MAX_IN_FLIGHT_REQUESTS until
            // the queue is empty.
            this.sendQueue.popFront()();
        }
        entry.handler(response);
    }
    // Sends a request to the host, and returns a promise that resolves with its
    // response.
    requestWithResponse(pipeId, requestType, request, transfer = []) {
        const { promise, resolve, reject } = Promise.withResolvers();
        const requestId = this.requestId++;
        const processFn = () => {
            this.responseHandlers.set(requestId, {
                type: requestType,
                handler: (response) => {
                    if (response.exception !== undefined) {
                        reject(this.router.errorCodec.deserialize(response.exception));
                    }
                    else {
                        resolve(response.responsePayload);
                    }
                },
            });
            this.router.sendRequest(pipeId, requestType, requestId, request, transfer);
        };
        if (this.isQueueing()) {
            if (!this.queueNoticeLogged) {
                console.warn(`WARNING! ${this.router.loggingPrefix}:` +
                    ` Too many in-flight requests, starting to queue them.`);
                this.queueNoticeLogged = true;
            }
            this.sendQueue.push(processFn);
        }
        else {
            processFn();
        }
        return promise;
    }
    requestNoResponse(pipeId, requestType, request, transfer = []) {
        if (!this.sendResponsesForAllRequests && !this.isQueueing()) {
            this.router.sendRequest(pipeId, requestType, undefined, request, transfer);
            return;
        }
        this.requestWithResponse(pipeId, requestType, request, transfer);
    }
    setMaxInFlightRequests(maxInFlightRequests) {
        if (maxInFlightRequests < 1) {
            this.maxInFlightRequests = Infinity;
        }
        else {
            this.maxInFlightRequests = maxInFlightRequests;
        }
    }
    isQueueing() {
        return this.inFlightRequestCount() >= this.maxInFlightRequests ||
            this.sendQueue.length > 0;
    }
}
// Receives requests over postMessage and forward them to a
// `PostMessageLifecycleObserver`.
export class PostMessageRequestReceiver {
    router;
    requestObserver;
    handlerWrapper = (_type, _interfaceName, payload, extras, handler) => handler(payload, extras);
    constructor(router, requestObserver) {
        this.router = router;
        this.requestObserver = requestObserver;
        assert(router.receiver === undefined);
        router.receiver = this;
    }
    setHandlerWrapper(wrapper) {
        this.handlerWrapper = wrapper;
    }
    async onMessage(requestMessage) {
        const { pipeId, senderId, requestId, type, requestPayload } = requestMessage;
        if (type === '__closePipe') {
            this.router.remoteClosedPipe(requestMessage.pipeId);
            return;
        }
        const pipe = this.router.getOrMakePipe(pipeId);
        // TODO(harringtond): Consider adding more debug logging for pending
        // messages or messages dropped due to pipe closure.
        if (pipe.pending()) {
            pipe.pushPendingMessage(this, requestMessage);
            return;
        }
        if (!pipe.open) {
            const exception = this.router.errorCodec.serialize(new Error(`Pipe closed`));
            if (requestId) {
                this.router.sendResponse(pipeId, type, senderId, requestId, undefined, exception);
            }
            return;
        }
        this.requestObserver.onRequestReceived?.(type, pipe.interfaceDef);
        const handleFn = pipe.getHandlerFunction(type);
        if (!handleFn) {
            return;
        }
        let response;
        let exception;
        const extras = new ResponseExtras();
        try {
            response = await this.handlerWrapper(type, pipe.interfaceDef, requestPayload, extras, handleFn);
        }
        catch (error) {
            this.requestObserver.onRequestHandlerException?.(type, pipe.interfaceDef);
            console.warn('Unexpected error', error);
            if (error instanceof Error) {
                exception = this.router.errorCodec.serialize(error);
            }
            else {
                exception = this.router.errorCodec.serialize(new Error(`Unexpected error: ${error}`));
            }
        }
        if (!exception) {
            this.requestObserver.onRequestCompleted?.(type, pipe.interfaceDef);
        }
        // If the message contains no `requestId`, a response is not requested.
        if (!requestId) {
            return;
        }
        this.router.sendResponse(pipeId, type, senderId, requestId, response, exception, extras.transfers);
    }
}
// Creates a direct in-memory messaging transport pair between host and client
// without going through real window.postMessage.
export function createDirectMessagingPair(logPrefix, errorCodec, clientRootHandler, hostRootHandler, clientInterfaceDef, hostInterfaceDef, clientLifecycleObserver = {}, hostLifecycleObserver = {}) {
    const targetForClient = {};
    const targetForHost = {};
    const senderToHost = {
        postMessage(message, _targetOrigin, _transfer) {
            queueMicrotask(() => {
                targetForHost.router?.onMessage({
                    origin: '*',
                    source: window,
                    data: message,
                    ports: [],
                });
            });
        },
    };
    const senderToClient = {
        postMessage(message, _targetOrigin, _transfer) {
            queueMicrotask(() => {
                targetForClient.router?.onMessage({
                    origin: '*',
                    source: window,
                    data: message,
                    ports: [],
                });
            });
        },
    };
    const clientSenderId = newSenderId();
    const hostSenderId = newSenderId();
    const routerClient = new PostMessageRouterImpl('*', clientSenderId, senderToHost, `${logPrefix}_client`, false, errorCodec);
    const routerHost = new PostMessageRouterImpl('*', hostSenderId, senderToClient, `${logPrefix}_host`, true, errorCodec);
    targetForClient.router = routerClient;
    targetForHost.router = routerHost;
    const clientSender = new PostMessageRequestSender(routerClient);
    const clientReceiver = new PostMessageRequestReceiver(routerClient, clientLifecycleObserver);
    const clientRootReceiver = routerClient.newReceiver(ROOT_PIPE, clientRootHandler, clientInterfaceDef);
    const clientRootRemote = new PostMessageRemoteImpl(ROOT_PIPE, clientSender, routerClient);
    const hostSender = new PostMessageRequestSender(routerHost);
    const hostReceiver = new PostMessageRequestReceiver(routerHost, hostLifecycleObserver);
    const hostRootReceiver = routerHost.newReceiver(ROOT_PIPE, hostRootHandler, hostInterfaceDef);
    const hostRootRemote = new PostMessageRemoteImpl(ROOT_PIPE, hostSender, routerHost);
    return {
        client: {
            router: routerClient,
            sender: clientSender,
            receiver: clientReceiver,
            rootRemote: clientRootRemote,
            rootReceiver: clientRootReceiver,
        },
        host: {
            router: routerHost,
            sender: hostSender,
            receiver: hostReceiver,
            rootRemote: hostRootRemote,
            rootReceiver: hostRootReceiver,
        },
    };
}
// Stores a set of non-negative integers in O(N) memory where N is the largest
// integer _not_ stored between [0, M], and M is the largest
// integer stored.
export class InverseSet {
    notContained = new Set();
    maxValue = -1;
    add(v) {
        assert(v >= 0);
        while (v > this.maxValue) {
            this.maxValue++;
            this.notContained.add(this.maxValue);
        }
        this.notContained.delete(v);
    }
    delete(v) {
        if (v <= this.maxValue) {
            this.notContained.add(v);
        }
    }
    has(v) {
        return v <= this.maxValue && !this.notContained.has(v);
    }
}
