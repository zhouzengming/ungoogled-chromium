import './organizer_list_section.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import type { OrganizerListSectionDelegate } from './organizer_list_section_delegate.js';
export interface OrganizerListElement {
    $: {
        sections: HTMLElement;
    };
}
export declare class OrganizerListElement extends CrLitElement {
    static get is(): string;
    static get styles(): import("//resources/lit/v3_0/lit.rollup.js").CSSResultGroup;
    render(): import("//resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    static get properties(): {
        sectionDelegates: {
            type: ArrayConstructor;
        };
        searchQuery: {
            type: StringConstructor;
        };
    };
    accessor sectionDelegates: Array<OrganizerListSectionDelegate<unknown>>;
    accessor searchQuery: string;
}
declare global {
    interface HTMLElementTagNameMap {
        'organizer-list': OrganizerListElement;
    }
}
