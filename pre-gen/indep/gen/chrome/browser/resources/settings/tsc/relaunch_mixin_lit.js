// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { LifetimeBrowserProxyImpl } from '/shared/settings/lifetime_browser_proxy.js';
import { assertNotReached } from 'chrome://resources/js/assert.js';
export var RestartType;
(function (RestartType) {
    RestartType[RestartType["RESTART"] = 0] = "RESTART";
    RestartType[RestartType["RELAUNCH"] = 1] = "RELAUNCH";
})(RestartType || (RestartType = {}));
export const RelaunchMixinLit = (superClass) => {
    class RelaunchMixinLit extends superClass {
        static get properties() {
            return {
                shouldShowRelaunchDialog: { type: Boolean },
            };
        }
        #shouldShowRelaunchDialog_accessor_storage = false;
        get shouldShowRelaunchDialog() { return this.#shouldShowRelaunchDialog_accessor_storage; }
        set shouldShowRelaunchDialog(value) { this.#shouldShowRelaunchDialog_accessor_storage = value; }
        lifetimeBrowserProxy_;
        constructor(...args) {
            super(...args);
            this.lifetimeBrowserProxy_ = LifetimeBrowserProxyImpl.getInstance();
        }
        onRelaunchDialogClose(_event) {
            this.shouldShowRelaunchDialog = false;
        }
        performRestartInternal_(restartType) {
            if (RestartType.RESTART === restartType) {
                this.lifetimeBrowserProxy_.restart();
            }
            else if (RestartType.RELAUNCH === restartType) {
                this.lifetimeBrowserProxy_.relaunch();
            }
            else {
                assertNotReached();
            }
        }
        // 
        async performRestartForNonChromeOs_(restartType, alwaysShowDialog) {
            const shouldShowDialog = await this.lifetimeBrowserProxy_.shouldShowRelaunchConfirmationDialog(alwaysShowDialog);
            if (!shouldShowDialog) {
                this.performRestartInternal_(restartType);
                return;
            }
            this.shouldShowRelaunchDialog = true;
        }
        // 
        performRestart(restartType, alwaysShowDialog) {
            if (alwaysShowDialog == null) {
                alwaysShowDialog = false;
            }
            // 
            // 
            this.performRestartForNonChromeOs_(restartType, alwaysShowDialog);
            // 
        }
    }
    return RelaunchMixinLit;
};
