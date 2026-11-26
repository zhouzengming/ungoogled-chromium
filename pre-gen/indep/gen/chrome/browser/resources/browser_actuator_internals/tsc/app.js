// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { getCss } from './app.css.js';
import { getHtml } from './app.html.js';
export class BrowserActuatorInternalsAppElement extends CrLitElement {
    static get is() {
        return 'browser-actuator-internals-app';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
}
customElements.define(BrowserActuatorInternalsAppElement.is, BrowserActuatorInternalsAppElement);
