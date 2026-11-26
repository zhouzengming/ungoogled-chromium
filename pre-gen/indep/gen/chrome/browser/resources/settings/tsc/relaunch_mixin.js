// Copyright 2021 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// clang-format off
import { assertNotReached } from 'chrome://resources/js/assert.js';
import { dedupingMixin } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import { LifetimeBrowserProxyImpl } from '/shared/settings/lifetime_browser_proxy.js';
// clang-format on
export var RestartType;
(function (RestartType) {
    RestartType[RestartType["RESTART"] = 0] = "RESTART";
    RestartType[RestartType["RELAUNCH"] = 1] = "RELAUNCH";
})(RestartType || (RestartType = {}));
/**
 * A helper Mixin to channel the relaunch/restart signal to native Chrome.
 * This uses LifetimeBrowserProxy under the surface but additionally supports
 * the <relaunch-confirmation-dialog> for non ChromeOS based desktop platforms.
 */
export const RelaunchMixin = dedupingMixin((superClass) => {
    class RelaunchMixin extends superClass {
        lifetimeBrowserProxy_;
        static get properties() {
            return {
                shouldShowRelaunchDialog: {
                    type: Boolean,
                    value: false,
                },
                restartTypeEnum: {
                    type: Object,
                    value: RestartType,
                },
            };
        }
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
            const shouldShowDialog = await this.lifetimeBrowserProxy_
                .shouldShowRelaunchConfirmationDialog(alwaysShowDialog);
            if (!shouldShowDialog) {
                this.performRestartInternal_(restartType);
                return;
            }
            this.shouldShowRelaunchDialog = true;
        }
        // 
        /**
         * This either performs restart or relaunch depending on the function
         * argument restartType. For non ChromeOS platforms it shows the
         * additional <relaunch-confirmation-dialog> html element **if** that
         * was specified in the caller's DOM, **otherwise** doesn't do anything.
         * Please see, RelaunchConfirmationDialogElement for more information on
         * how to add the new <relaunch-confirmation-dialog> element in the DOM.
         *
         * @param restartType This specifies the type of restart to perform.
         * @param alwaysShowDialog Always show a confirmation dialog before the
         *     restart if this parameter is true. Otherwise, only when there is
         *     an incognito window open.
         */
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
    return RelaunchMixin;
});
