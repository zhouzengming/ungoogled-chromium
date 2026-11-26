import { ObservableValue as ObservableValueImpl } from '../../observable.js';
import type { WebClientHost } from '../request_types.js';
import type { //
InterfaceDef, //
PendingRemote, //
PostMessageHandler, //
PostMessageRemote, //
PostMessageRouter } from '../transport/post_message_transport.js';
export interface ObservableSetByTabIdDelegate<ObservedType, ObserverInterface extends InterfaceDef = InterfaceDef> {
    readonly interfaceDef: ObserverInterface;
    readonly unsubscribeDelay: number;
    subscribe(clientRemote: PostMessageRemote<WebClientHost>, tabId: string, remote: PendingRemote<ObserverInterface>): void;
    createHandler(observable: ObservableValueImpl<ObservedType>): PostMessageHandler<ObserverInterface>;
}
export declare class ObservableSetByTabId<ObservedType, ObserverInterface extends InterfaceDef = InterfaceDef> {
    private delegate;
    private clientRemote;
    private router;
    private observablesByTabId;
    constructor(delegate: ObservableSetByTabIdDelegate<ObservedType, ObserverInterface>, clientRemote: PostMessageRemote<WebClientHost>, router: PostMessageRouter);
    getObservableByTabId(tabId: string): ObservableSetByTabIdObservable<ObservedType, ObserverInterface>;
}
export declare class ObservableSetByTabIdObservable<ObservedType, ObserverInterface extends InterfaceDef = InterfaceDef> extends ObservableValueImpl<ObservedType> {
    tabId: string;
    private clientRemote;
    private router;
    private delegate;
    private onComplete;
    private unsubscribeTimer;
    private receiver?;
    private isCompleting;
    constructor(tabId: string, clientRemote: PostMessageRemote<WebClientHost>, router: PostMessageRouter, delegate: ObservableSetByTabIdDelegate<ObservedType, ObserverInterface>, onComplete: () => void);
    activeSubscriptionChanged(hasActiveSubscription: boolean): void;
    complete(): void;
}
