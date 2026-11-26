import 'chrome://resources/cr_components/composebox/composebox_favicon_group.js';
import type { ComposeboxFaviconGroupElement } from 'chrome://resources/cr_components/composebox/composebox_favicon_group.js';
import { CrLitElement } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import type { CSSResultGroup } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import type { TabInfo } from 'chrome://resources/mojo/components/omnibox/browser/searchbox.mojom-webui.js';
export interface ContextLibraryElement {
    $: {
        faviconGroup: ComposeboxFaviconGroupElement;
    };
}
export declare class ContextLibraryElement extends CrLitElement {
    static get is(): string;
    static get styles(): CSSResultGroup;
    render(): import("chrome://resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    static get properties(): {
        tabs: {
            type: ArrayConstructor;
        };
        submittedTabIds: {
            type: ObjectConstructor;
        };
    };
    accessor tabs: TabInfo[];
    accessor submittedTabIds: Set<number>;
    private resizeObserver_;
    private messageListener_;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected onWaitForTabLoad_(_e: CustomEvent<{
        tabId: number;
        onTabLoaded: (url?: string) => void;
    }>): void;
}
declare global {
    interface Window {
        requestResize?: () => void;
    }
    interface HTMLElementTagNameMap {
        'context-library': ContextLibraryElement;
    }
}
