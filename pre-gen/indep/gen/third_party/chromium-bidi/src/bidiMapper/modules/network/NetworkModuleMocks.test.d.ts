import type { Protocol } from 'devtools-protocol';
import { type CdpClient, type CdpEvents } from '../../../cdp/CdpClient.js';
import { EventEmitter } from '../../../utils/EventEmitter.js';
export declare class MockCdpNetworkEvents {
    static defaultFrameId: string;
    static defaultUrl: string;
    cdpClient: CdpClient;
    url: string;
    requestId: string;
    fetchId: string;
    private loaderId;
    private frameId;
    private type;
    private initiator;
    constructor(cdpClient: CdpClient, { requestId, fetchId, loaderId, url, frameId, type, initiator, }?: Partial<{
        requestId: string;
        fetchId: string;
        loaderId: string;
        url: string;
        frameId: string | null;
        type: Protocol.Network.ResourceType;
        initiator: Protocol.Network.Initiator;
    }>);
    requestWillBeSent(): void;
    requestWillBeSentRedirect(): void;
    requestWillBeSentExtraInfo(): void;
    requestServedFromCache(): void;
    responseReceivedExtraInfo(): void;
    responseReceivedExtraInfoRedirect(): void;
    responseReceived(hasExtraInfo?: boolean): void;
    requestPaused(): void;
    responsePaused(): void;
    authRequired(): void;
    loadingFailed(): void;
    loadingFinished(): void;
    setJsonEvent(json: string | Record<string, unknown>, _normalize?: boolean): void;
    findAndReplaceKey(source: Record<string, unknown>, searchKey: string, value: unknown): void;
}
export declare class MockCdpClient extends EventEmitter<CdpEvents> {
    #private;
    sessionId: string;
    constructor(logger: (...args: any[]) => void);
    sendCommand(...args: any[]): Promise<unknown>;
    isCloseError(error: unknown): boolean;
}
export declare class MockCdpTarget {
    #private;
    cdpClient: CdpClient;
    constructor(logger: (...args: any[]) => void);
    enableFetchIfNeeded(): Promise<void>;
    get topLevelId(): string;
    isSubscribedTo(): boolean;
}
