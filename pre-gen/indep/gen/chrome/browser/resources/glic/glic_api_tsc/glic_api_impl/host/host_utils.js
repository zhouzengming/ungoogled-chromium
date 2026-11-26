// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Automatically closes all pipes when one of them is closed.
export function linkPipeClosure(...entries) {
    let activeEntries = entries;
    const destroy = () => {
        if (!activeEntries) {
            return;
        }
        for (const entry of activeEntries) {
            if (entry.$) {
                entry.$.close();
            }
            else {
                entry.close();
            }
        }
        activeEntries = null;
    };
    for (const entry of entries) {
        if (entry.$) {
            entry.onConnectionError.addListener(() => {
                destroy();
            });
        }
        else {
            entry.addCloseHandler(() => {
                destroy();
            });
        }
    }
}
// Automatically creates a postMessage remote from a PendingRemote, wraps it
// in a Mojo receiver using the provided constructors, links their lifecycles,
// and returns the bound Mojo receiver and Mojo remote.
export function createForwardingMojoRemote(router, postMessagePipe, receiverConstructor, implConstructor) {
    const pmRemote = router.newRemote(postMessagePipe);
    const mojoReceiver = new receiverConstructor(new implConstructor(pmRemote));
    const mojoRemote = mojoReceiver.$.bindNewPipeAndPassRemote();
    linkPipeClosure(pmRemote, mojoReceiver);
    return { receiver: mojoReceiver, remote: mojoRemote };
}
