import type { WebViewType } from '../shared/web_view_type.js';
export declare class GlicRequestHeaderInjector {
    private chromeVersion;
    private chromeChannel;
    private onDestroy;
    constructor(webview: WebViewType, chromeVersion: string, chromeChannel: string, requestTypes: string);
    destroy(): void;
    private onBeforeSendHeaders;
    private headers;
}
