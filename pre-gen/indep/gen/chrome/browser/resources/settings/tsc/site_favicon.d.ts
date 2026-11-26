import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
export interface SiteFaviconElement {
    $: {
        favicon: HTMLElement;
    };
}
export declare class SiteFaviconElement extends PolymerElement {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        faviconUrl: StringConstructor;
        url: StringConstructor;
        iconPath: StringConstructor;
    };
    faviconUrl: string;
    url: string;
    iconPath: string;
    private getBackgroundImage_;
    /**
     * Removes the wildcard prefix from a pattern string.
     * @param pattern The pattern to remove the wildcard from.
     * @return The resulting pattern.
     */
    private removePatternWildcard_;
    /**
     * Ensures the URL has a scheme (assumes http if omitted).
     * @param url The URL with or without a scheme.
     * @return The URL with a scheme, or an empty string.
     */
    private ensureUrlHasScheme_;
}
declare global {
    interface HTMLElementTagNameMap {
        'site-favicon': SiteFaviconElement;
    }
}
