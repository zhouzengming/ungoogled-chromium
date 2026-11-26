/**
 * @fileoverview 'category-reference-card' is a card that shows a list of
 * chips related to a certain category.
 */
import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
import '../settings_shared.css.js';
import 'chrome://resources/cr_elements/cr_button/cr_button.js';
import 'chrome://resources/cr_elements/cr_icon/cr_icon.js';
import 'chrome://resources/cr_elements/cr_link_row/cr_link_row.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import type { YourSavedInfoDataCategory, YourSavedInfoDataChip } from '../metrics_browser_proxy.js';
import type { DataChip } from './autofill_page.js';
export type DataChipClickEvent = CustomEvent<{
    chipId: YourSavedInfoDataChip;
}>;
export type DataCategoryClickEvent = CustomEvent<{
    categoryId: YourSavedInfoDataCategory;
}>;
declare global {
    interface HTMLElementEventMap {
        'data-chip-click': DataChipClickEvent;
        'data-category-click': DataCategoryClickEvent;
    }
}
export declare class CategoryReferenceCardElement extends PolymerElement {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        cardTitle: StringConstructor;
        categoryId: NumberConstructor;
        chips: {
            type: ArrayConstructor;
            value: () => never[];
        };
        isExternal: {
            type: BooleanConstructor;
        };
    };
    cardTitle: string;
    categoryId: YourSavedInfoDataCategory;
    chips: DataChip[];
    isExternal: boolean;
    private onDataCategoryClick_;
    private onDataChipClick_;
    focus(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'category-reference-card': CategoryReferenceCardElement;
    }
}
