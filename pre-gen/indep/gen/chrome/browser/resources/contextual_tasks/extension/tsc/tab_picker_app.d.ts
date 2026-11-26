import 'chrome://resources/cr_components/composebox/composebox_favicon_group.js';
import 'chrome://resources/cr_components/composebox/composebox_tab_favicon.js';
import 'chrome://resources/cr_components/composebox/icons.html.js';
import 'chrome://resources/cr_elements/cr_action_menu/cr_action_menu.js';
import 'chrome://resources/cr_elements/cr_icon/cr_icon.js';
import 'chrome://resources/cr_elements/icons.html.js';
import type { CrActionMenuElement } from 'chrome://resources/cr_elements/cr_action_menu/cr_action_menu.js';
import { CrLitElement } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import type { PropertyValues } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import type { TabInfo } from 'chrome://resources/mojo/components/omnibox/browser/searchbox.mojom-webui.js';
export interface TabPickerAppElement {
    $: {
        shareTabsTrigger: HTMLButtonElement;
        tabMenu: CrActionMenuElement;
    };
}
declare const TabPickerAppElementBase: typeof CrLitElement & (new (...args: any[]) => import("chrome://resources/cr_elements/i18n_mixin_lit.js").I18nMixinLitInterface);
export declare class TabPickerAppElement extends TabPickerAppElementBase {
    static get is(): string;
    static get styles(): import("chrome://resources/lit/v3_0/lit.rollup.js").CSSResultGroup;
    render(): import("chrome://resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    static get properties(): {
        tabSuggestions: {
            type: ArrayConstructor;
        };
        selectedTabs: {
            type: ArrayConstructor;
        };
        tabMenuOpen: {
            type: BooleanConstructor;
        };
        recentTabId: {
            type: NumberConstructor;
        };
        sharingTabsText_: {
            type: StringConstructor;
        };
        useUnbounded: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        darkMode: {
            type: BooleanConstructor;
            reflect: boolean;
            attribute: string;
        };
    };
    accessor tabSuggestions: TabInfo[];
    accessor selectedTabs: TabInfo[];
    accessor tabMenuOpen: boolean;
    accessor recentTabId: number | null;
    protected accessor sharingTabsText_: string;
    accessor useUnbounded: boolean;
    accessor darkMode: boolean;
    private closeTimer_;
    private browserProxy_;
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(): void;
    updated(changedProperties: PropertyValues<this>): void;
    private initializeUnboundedMenu_;
    private fetchTabSuggestions_;
    protected isUnboundedMenuEnabled_(): boolean;
    protected isDarkModeEnabled_(): boolean;
    protected get hasTabSuggestions_(): boolean;
    private updateSharingTabsText_;
    protected getRecentTabsSuffix_(): string;
    protected isRecentTab_(tabId: number): boolean;
    protected isTabSelected_(tab: TabInfo): boolean;
    protected onShareTabsRowPointerenter_(): void;
    protected onShareTabsRowPointerleave_(): void;
    protected onShareTabsRowClick_(): void;
    protected onShareTabsRowKeydown_(e: KeyboardEvent): void;
    protected onMenuPointerenter_(): void;
    protected onMenuPointerleave_(): void;
    protected onMenuClose_(): void;
    protected onTabClick_(e: Event): void;
    private openTabMenu_;
    private scheduleCloseTimer_;
    private cancelCloseTimer_;
    setDarkModeForTesting(darkMode: boolean): void;
    getDarkModeForTesting(): boolean;
}
declare global {
    interface HTMLElementTagNameMap {
        'tab-picker-app': TabPickerAppElement;
    }
}
export {};
