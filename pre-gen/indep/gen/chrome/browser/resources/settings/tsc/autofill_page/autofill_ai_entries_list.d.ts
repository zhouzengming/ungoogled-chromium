/**
 * @fileoverview 'settings-autofill-entries-list-element' contains configuration
 * options for Autofill AI.
 */
import 'chrome://resources/cr_elements/cr_action_menu/cr_action_menu.js';
import 'chrome://resources/cr_elements/cr_button/cr_button.js';
import 'chrome://resources/cr_elements/cr_icon/cr_icon.js';
import 'chrome://resources/cr_elements/cr_icons.css.js';
import 'chrome://resources/cr_elements/cr_icon_button/cr_icon_button.js';
import 'chrome://resources/cr_elements/cr_lazy_render/cr_lazy_render.js';
import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import '/shared/settings/prefs/prefs.js';
import 'chrome://resources/cr_elements/icons.html.js';
import '../icons.html.js';
import '../privacy_icons.html.js';
import '../settings_shared.css.js';
import '../simple_confirmation_dialog.js';
import './autofill_ai_add_or_edit_dialog.js';
import './autofill_shared.css.js';
import type { CrActionMenuElement } from 'chrome://resources/cr_elements/cr_action_menu/cr_action_menu.js';
import type { CrLazyRenderElement } from 'chrome://resources/cr_elements/cr_lazy_render/cr_lazy_render.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import { EntityTypeName } from '../autofill_ai_enums.mojom-webui.js';
export interface SettingsAutofillAiEntriesListElement {
    $: {
        actionMenu: CrLazyRenderElement<CrActionMenuElement>;
        addMenu: CrLazyRenderElement<CrActionMenuElement>;
    };
}
declare const SettingsAutofillAiEntriesListElementBase: typeof PolymerElement & (new (...args: any[]) => import("/shared/settings/prefs/prefs_mixin.js").PrefsMixinInterface) & (new (...args: any[]) => import("chrome://resources/cr_elements/i18n_mixin.js").I18nMixinInterface) & (new (...args: any[]) => import("chrome://resources/cr_elements/web_ui_listener_mixin.js").WebUiListenerMixinInterface) & (new (...args: any[]) => import("../settings_page/settings_view_mixin.js").SettingsViewMixinInterface);
export declare class SettingsAutofillAiEntriesListElement extends SettingsAutofillAiEntriesListElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        /**
         Controls whether the user can use Autofill AI. For example this can be
         false if the extensions API disables the feature.
         Specifically in this file, it controls whether users can add new
         entities.
        */
        canEnableOrDisableAutofillAi_: {
            type: BooleanConstructor;
            value(): boolean;
        };
        allowedEntityTypes: {
            type: SetConstructor;
            value: null;
        };
        listTitle: {
            type: StringConstructor;
        };
        pageName: {
            type: StringConstructor;
            value: string;
        };
        metricEntityTypes: {
            type: ObjectConstructor;
            value: null;
        };
        /**
           Optional boolean preference used to determine the list's editability.
           If true - user will be able to add new entries to the list.
  
           Notes:
            * Even if preference is true the user may still be prevented from
              adding entries due to other eligibility checks.
            * We assume that the provided preference is controlled by the address
              autofill policy and extension API. If allowNewEntitiesAdditionPref is provided
              its value will be overridden by the address autofill preference when
              it is enforced.
        */
        allowNewEntitiesAdditionPref: {
            type: ObjectConstructor;
            value: null;
        };
        allowNewEntitiesAddition_: {
            type: BooleanConstructor;
            value: boolean;
        };
        /**
           The corresponding `EntityInstance` model for any entity instance
           related action menus or dialogs.
         */
        activeEntityInstance_: {
            type: ObjectConstructor;
            value: null;
        };
        /**
           Complete list of entity types that exist. When the user wants to add a
           new entity instance, this list is displayed.
         */
        completeEntityTypesList_: {
            type: ArrayConstructor;
            value: () => never[];
        };
        /**
           The same dialog can be used for both adding and editing entity
           instances.
         */
        showAddOrEditEntityInstanceDialog_: {
            type: BooleanConstructor;
            value: boolean;
        };
        addOrEditEntityInstanceDialogTitle_: {
            type: StringConstructor;
            value: string;
        };
        showRemoveEntityInstanceDialog_: {
            type: BooleanConstructor;
            value: boolean;
        };
        activeEntityInstanceDeleteTitle_: {
            type: StringConstructor;
            value: string;
        };
        entityInstances_: {
            type: ArrayConstructor;
            value: () => never[];
        };
        /**
          If true, Autofill AI does not depend on whether Autofill for addresses
          is enabled.
        */
        autofillSettingsEnterprisePolicyEnabled_: {
            type: BooleanConstructor;
            value(): boolean;
        };
    };
    static get observers(): string[];
    allowedEntityTypes: Set<EntityTypeName> | null;
    listTitle: string;
    pageName: string;
    metricEntityTypes: Record<EntityTypeName, string> | null;
    allowNewEntitiesAdditionPref: chrome.settingsPrivate.PrefObject<boolean> | null;
    private allowNewEntitiesAddition_;
    private completeEntityTypesList_;
    private activeEntityInstance_;
    private showAddOrEditEntityInstanceDialog_;
    private addOrEditEntityInstanceDialogTitle_;
    private showRemoveEntityInstanceDialog_;
    private activeEntityInstanceDeleteTitle_;
    private entityInstances_;
    private autofillSettingsEnterprisePolicyEnabled_;
    private canEnableOrDisableAutofillAi_;
    private activeEntityInstanceGuid_;
    private metricsBrowserProxy_;
    private entityInstancesChangedListener_;
    private entityDataManager_;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private updateEntityTypesList_;
    private entityTypesComparator_;
    /**
     * This comparator compares the labels alphabetically, and, in case of
     * equality, the sublabels.
     * This comparator purposefully uses sensitivity 'base', not to differentiate
     * between different capitalization or diacritics.
     */
    private entityInstancesWithLabelsComparator_;
    private getMetricEntityTypeString_;
    /**
     * Handles tapping on the "Add" entity instance button.
     */
    private onAddEntityInstanceClick_;
    private onAddEntityInstanceFromDropdownClick_;
    /**
     * Open the action menu.
     */
    private onMoreButtonClick_;
    /**
     * Handles tapping on the "Edit" entity instance button in the action menu.
     */
    private onMenuEditEntityInstanceClick_;
    /**
     * Handles tapping on the "Delete" entity instance button in the action menu.
     */
    private onMenuRemoveEntityInstanceClick_;
    private onAutofillAiAddOrEditDone_;
    private onAddOrEditEntityInstanceDialogClose_;
    private onRemoveEntityInstanceDialogClose_;
    private onRemoteWalletPassesLinkClick_;
    private updateAllowNewEntitiesAddition_;
    private onSyncStatusChanged_;
    private get isNewEntitiesAdditionAllowedByPref_();
    private typeNameToIconName_;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-autofill-ai-entries-list': SettingsAutofillAiEntriesListElement;
    }
}
export {};
