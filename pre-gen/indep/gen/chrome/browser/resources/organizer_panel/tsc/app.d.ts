import 'chrome://resources/cr_elements/cr_toolbar/cr_toolbar_search_field.js';
import './organizer_list.js';
import '/strings.m.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import type { CrToolbarSearchFieldElement } from 'chrome://resources/cr_elements/cr_toolbar/cr_toolbar_search_field.js';
import type { OrganizerListElement } from './organizer_list.js';
import type { OrganizerListSectionDelegate } from './organizer_list_section_delegate.js';
export interface OrganizerPanelAppElement {
    $: {
        list: OrganizerListElement;
        searchField: CrToolbarSearchFieldElement;
    };
}
export declare class OrganizerPanelAppElement extends CrLitElement {
    static get is(): string;
    static get styles(): import("//resources/lit/v3_0/lit.rollup.js").CSSResultGroup;
    render(): import("//resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    static get properties(): {
        shortcut_: {
            type: StringConstructor;
        };
        sectionDelegates_: {
            type: ArrayConstructor;
        };
        searchQuery_: {
            type: StringConstructor;
        };
    };
    protected accessor shortcut_: string;
    protected accessor searchQuery_: string;
    protected accessor sectionDelegates_: Array<OrganizerListSectionDelegate<unknown>>;
    protected onSearchChanged_(e: CustomEvent<string>): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'organizer-panel-app': OrganizerPanelAppElement;
    }
}
