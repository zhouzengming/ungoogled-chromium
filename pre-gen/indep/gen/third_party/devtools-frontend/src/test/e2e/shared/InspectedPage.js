// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { assert } from 'chai';
import { PageWrapper } from './PageWrapper.js';
export class InspectedPage extends PageWrapper {
    serverPort;
    constructor(page, serverPort) {
        super(page);
        this.serverPort = serverPort;
        this.serverPort = serverPort;
    }
    async goTo(url, options = {}) {
        await this.page.goto(url, options);
    }
    async goToHtml(unparsedHtml) {
        let html = unparsedHtml;
        if (!html.trim().startsWith('<!DOCTYPE html>')) {
            html = `<!DOCTYPE html>${html}`;
        }
        return await this.goTo(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
    }
    waitForSelector(selector, options) {
        return this.page.waitForSelector(selector, options);
    }
    async goToResource(path, options = {}) {
        await this.goTo(`${this.getResourcesPath()}/${path}`, options);
    }
    async goToResourceWithCustomHost(host, path) {
        assert.isTrue(host.endsWith('.test'), 'Only custom hosts with a .test domain are allowed.');
        await this.goTo(`${this.getResourcesPath(host)}/${path}`);
    }
    getResourcesPath(host = 'localhost') {
        return `${this.domain(host)}/test/e2e/resources`;
    }
    domain(host = 'localhost') {
        return `https://${host}:${this.serverPort}`;
    }
    getOopifResourcesPath() {
        return this.getResourcesPath('devtools.oopif.test');
    }
    async overridePermissions(permissions) {
        await this.page.browserContext().overridePermissions(`https://localhost:${this.serverPort}`, permissions);
    }
}
export async function setupInspectedPage(context, serverPort) {
    const page = await context.newPage();
    return new InspectedPage(page, serverPort);
}
//# sourceMappingURL=InspectedPage.js.map