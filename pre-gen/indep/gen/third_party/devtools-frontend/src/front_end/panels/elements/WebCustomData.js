// Copyright 2023 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * Lazily loads the vscode.web-custom-data/browser.css-data.json and allows
 * lookup by property name.
 *
 * The class intentionally doesn't return any promise to the loaded data.
 * Otherwise clients would need to Promise.race against a timeout to handle
 * the case where the data is not yet available.
 */
export class WebCustomData {
    #data = new Map();
    /** The test actually needs to wait for the result */
    fetchPromiseForTest;
    constructor(remoteBase) {
        this.fetchPromiseForTest = Promise.resolve();
    }
    /**
     * Creates a fresh `WebCustomData` instance using the standard
     * DevTools remote base.
     * Throws if no valid remoteBase was found.
     */
    static create() {
        // Silently skip loading of the CSS data if remoteBase is not set properly.
        return new WebCustomData('');
    }
    /**
     * Returns the documentation for the CSS property `name` or `undefined` if
     * no such property is documented. Also returns `undefined` if data hasn't
     * finished loading or failed to load.
     */
    findCssProperty(name) {
        return this.#data.get(name);
    }
}
//# sourceMappingURL=WebCustomData.js.map