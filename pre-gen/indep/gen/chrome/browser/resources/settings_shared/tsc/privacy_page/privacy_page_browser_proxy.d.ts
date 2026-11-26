export interface MetricsReporting {
    enabled: boolean;
    managed: boolean;
}
export interface PrivacyPageBrowserProxy {
}
export declare class PrivacyPageBrowserProxyImpl implements PrivacyPageBrowserProxy {
    static getInstance(): PrivacyPageBrowserProxy;
    static setInstance(obj: PrivacyPageBrowserProxy): void;
}
