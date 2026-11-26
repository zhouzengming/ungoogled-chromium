// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
export class ResponseExtras {
    transfers = [];
    // Add objects to transfer when sending the response over postMessage.
    addTransfer(...transfers) {
        this.transfers.push(...transfers);
    }
}
// Defines a message type. Ensures the message is structured cloneable.
// Currently returns undefined, as no information about the message is retained
// at runtime.
export function defMessage() {
    return undefined;
}
export function defInterface(def) {
    const tidyRequest = (m) => {
        const id = m.histogram?.id;
        if (id === undefined) {
            return m;
        }
        let name = m.histogram.name;
        if (name === undefined) {
            name = m.name.charAt(0).toUpperCase() + m.name.slice(1);
        }
        return { ...m, histogram: { name, id } };
    };
    return {
        ...def,
        methodMap: new Map(def.methods.map(m => [m.name, tidyRequest(m)])),
    };
}
/* eslint-disable-next-line @typescript-eslint/naming-convention */
export function assertNever() { }
