// Copyright 2016 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
export class PrivacyPageBrowserProxyImpl {
    // 
    static getInstance() {
        return instance || (instance = new PrivacyPageBrowserProxyImpl());
    }
    static setInstance(obj) {
        instance = obj;
    }
}
let instance = null;
