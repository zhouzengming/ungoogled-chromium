// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { GlicHostRegistryImpl } from './client/glic_api_client.js';
import { GlicApiHost } from './host/glic_api_host.js';
import { ERROR_CODEC, WebClientDef, WebClientHostDef } from './request_types.js';
import { createDirectMessagingPair } from './transport/post_message_transport.js';
/*
This is bundled into a js file, and sent to the web client. It should be
directly executable in a <script> element, and therefore should not have any
exports.
*/
class InFrameGlicBoot {
    static createRegistry() {
        return {
            async registerWebClient(webClient) {
                // Note: A migration is underway to use mojo directly from the
                // web client code. In the interim, there is still the guise of a
                // client/host architecture here, but in fact the host and client are
                // directly coupled.
                const directPair = createDirectMessagingPair('glic_api', ERROR_CODEC, 
                // client root handler will be bound by GlicBrowserHostImpl later,
                // with setMessageHandler. For now, no messages will be handled.
                undefined, 
                // host root handler will be bound by GlicApiHost below, with
                // setMessageHandler. For now, no messages will be handled.
                undefined, WebClientDef, WebClientHostDef);
                const hostApi = new GlicApiHost(directPair.host.rootRemote, directPair.host.router);
                window.addEventListener('click', (e) => {
                    const target = e.target?.closest?.('a');
                    if (target && target.getAttribute('target') === '_blank' &&
                        target.href) {
                        e.preventDefault();
                        hostApi?.openLinkInNewTab(target.href);
                    }
                }, true);
                directPair.host.rootReceiver.setMessageHandler(hostApi.hostMessageHandler, WebClientHostDef);
                const clientHostRegistry = new GlicHostRegistryImpl(directPair, hostApi);
                return clientHostRegistry.registerWebClient(webClient);
            },
        };
    }
}
window.internalAutoGlicBoot = (_windowProxy) => InFrameGlicBoot.createRegistry();
