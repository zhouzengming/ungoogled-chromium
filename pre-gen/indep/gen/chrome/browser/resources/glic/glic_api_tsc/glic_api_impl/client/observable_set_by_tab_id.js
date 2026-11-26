// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { ObservableValue as ObservableValueImpl } from '../../observable.js';
import { OneShotTimer } from '../../timer.js';
// Manages a set of observables which each observe a tab.
// When a tab is closed, the corresponding observable is completed, and
// removed from the set. Otherwise, observables are kept in the set,
// so they can be re-subscribed to later.
export class ObservableSetByTabId {
    delegate;
    clientRemote;
    router;
    observablesByTabId = new Map();
    constructor(delegate, clientRemote, router) {
        this.delegate = delegate;
        this.clientRemote = clientRemote;
        this.router = router;
    }
    getObservableByTabId(tabId) {
        let obs = this.observablesByTabId.get(tabId);
        if (obs !== undefined) {
            return obs;
        }
        obs = new ObservableSetByTabIdObservable(tabId, this.clientRemote, this.router, this.delegate, () => {
            this.observablesByTabId.delete(tabId);
        });
        this.observablesByTabId.set(tabId, obs);
        return obs;
    }
}
// An observable representing a lazy, reference-counted, and debounced
// stream of updates for a specific tab from the host.
//
// It connects when the first subscriber joins, disconnects with a delay when
// the last subscriber leaves, and cleans itself up on completion.
export class ObservableSetByTabIdObservable extends ObservableValueImpl {
    tabId;
    clientRemote;
    router;
    delegate;
    onComplete;
    unsubscribeTimer;
    receiver;
    isCompleting = false;
    constructor(tabId, clientRemote, router, delegate, onComplete) {
        super(/*isSet=*/ false);
        this.tabId = tabId;
        this.clientRemote = clientRemote;
        this.router = router;
        this.delegate = delegate;
        this.onComplete = onComplete;
        this.unsubscribeTimer = new OneShotTimer(delegate.unsubscribeDelay);
    }
    activeSubscriptionChanged(hasActiveSubscription) {
        super.activeSubscriptionChanged(hasActiveSubscription);
        if (!hasActiveSubscription) {
            this.unsubscribeTimer.start(() => {
                if (this.hasActiveSubscription()) {
                    return;
                }
                this.complete();
            });
            return;
        }
        this.unsubscribeTimer.reset();
        if (!this.receiver) {
            const { receiver, remote } = this.router.newPipeWithReceiver(this.delegate.createHandler(this), this.delegate.interfaceDef);
            this.receiver = receiver;
            this.receiver.addCloseHandler(() => {
                this.complete();
            });
            this.delegate.subscribe(this.clientRemote, this.tabId, remote);
        }
    }
    complete() {
        // As this is an observable, it can be completed only once. Early exit if
        // already complete.
        if (this.isCompleting || this.isStopped()) {
            return;
        }
        this.isCompleting = true;
        this.receiver?.close();
        this.receiver = undefined;
        this.onComplete();
        super.complete();
    }
}
