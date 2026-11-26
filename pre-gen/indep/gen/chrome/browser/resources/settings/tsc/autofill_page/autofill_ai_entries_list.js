// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
import { PrefsMixin } from '/shared/settings/prefs/prefs_mixin.js';
import { CrSettingsPrefs } from '/shared/settings/prefs/prefs_types.js';
import { AnchorAlignment } from 'chrome://resources/cr_elements/cr_action_menu/cr_action_menu.js';
import { I18nMixin } from 'chrome://resources/cr_elements/i18n_mixin.js';
import { WebUiListenerMixin } from 'chrome://resources/cr_elements/web_ui_listener_mixin.js';
import { assert } from 'chrome://resources/js/assert.js';
import { OpenWindowProxyImpl } from 'chrome://resources/js/open_window_proxy.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import { AiEnterpriseFeaturePrefName, ModelExecutionEnterprisePolicyValue } from '../ai_page/constants.js';
import { EntityTypeName } from '../autofill_ai_enums.mojom-webui.js';
import { loadTimeData } from '../i18n_setup.js';
import { MetricsBrowserProxyImpl } from '../metrics_browser_proxy.js';
import { SettingsViewMixin } from '../settings_page/settings_view_mixin.js';
import { getTemplate } from './autofill_ai_entries_list.html.js';
import { EntityDataManagerProxyImpl } from './entity_data_manager_proxy.js';
const SettingsAutofillAiEntriesListElementBase = SettingsViewMixin(WebUiListenerMixin(I18nMixin(PrefsMixin(PolymerElement))));
export class SettingsAutofillAiEntriesListElement extends SettingsAutofillAiEntriesListElementBase {
    static get is() {
        return 'settings-autofill-ai-entries-list';
    }
    static get template() {
        return getTemplate();
    }
    static get properties() {
        return {
            /**
             Controls whether the user can use Autofill AI. For example this can be
             false if the extensions API disables the feature.
             Specifically in this file, it controls whether users can add new
             entities.
            */
            canEnableOrDisableAutofillAi_: {
                type: Boolean,
                value() {
                    return loadTimeData.getBoolean('canEnableOrDisableAutofillAi');
                },
            },
            allowedEntityTypes: {
                type: Set,
                value: null,
            },
            listTitle: {
                type: String,
            },
            pageName: {
                type: String,
                value: '',
            },
            metricEntityTypes: {
                type: Object,
                value: null,
            },
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
                type: Object,
                value: null,
            },
            allowNewEntitiesAddition_: {
                type: Boolean,
                value: false,
            },
            /**
               The corresponding `EntityInstance` model for any entity instance
               related action menus or dialogs.
             */
            activeEntityInstance_: {
                type: Object,
                value: null,
            },
            /**
               Complete list of entity types that exist. When the user wants to add a
               new entity instance, this list is displayed.
             */
            completeEntityTypesList_: {
                type: Array,
                value: () => [],
            },
            /**
               The same dialog can be used for both adding and editing entity
               instances.
             */
            showAddOrEditEntityInstanceDialog_: {
                type: Boolean,
                value: false,
            },
            addOrEditEntityInstanceDialogTitle_: {
                type: String,
                value: '',
            },
            showRemoveEntityInstanceDialog_: {
                type: Boolean,
                value: false,
            },
            activeEntityInstanceDeleteTitle_: {
                type: String,
                value: '',
            },
            entityInstances_: {
                type: Array,
                value: () => [],
            },
            /**
              If true, Autofill AI does not depend on whether Autofill for addresses
              is enabled.
            */
            autofillSettingsEnterprisePolicyEnabled_: {
                type: Boolean,
                value() {
                    return loadTimeData.getBoolean('AutofillSettingsEnterprisePolicyEnabled');
                },
            },
        };
    }
    static get observers() {
        return [
            'updateAllowNewEntitiesAddition_(' +
                'prefs.autofill.profile_enabled.value, ' +
                `prefs.${AiEnterpriseFeaturePrefName.AUTOFILL_AI}.value, ` +
                'allowNewEntitiesAdditionPref.*)',
        ];
    }
    activeEntityInstanceGuid_ = null;
    metricsBrowserProxy_ = MetricsBrowserProxyImpl.getInstance();
    entityInstancesChangedListener_ = null;
    entityDataManager_ = EntityDataManagerProxyImpl.getInstance();
    connectedCallback() {
        super.connectedCallback();
        this.entityInstancesChangedListener_ =
            (entityInstances) => {
                // Filter only if the filter was set
                const filteredEntityInstaces = this.allowedEntityTypes ?
                    entityInstances.filter(instance => this.allowedEntityTypes.has(instance.type.typeName)) :
                    entityInstances;
                this.entityInstances_ = filteredEntityInstaces.sort(this.entityInstancesWithLabelsComparator_);
            };
        this.entityDataManager_.loadEntityInstances().then(this.entityInstancesChangedListener_);
        this.entityDataManager_.addEntityInstancesChangedListener(this.entityInstancesChangedListener_);
        this.entityDataManager_.getWritableEntityTypes().then((entityTypes) => {
            this.updateEntityTypesList_(entityTypes);
        });
        this.addWebUiListener('sync-status-changed', this.onSyncStatusChanged_.bind(this));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        assert(this.entityInstancesChangedListener_);
        this.entityDataManager_.removeEntityInstancesChangedListener(this.entityInstancesChangedListener_);
        this.entityInstancesChangedListener_ = null;
    }
    updateEntityTypesList_(entityTypes) {
        // Filter only if the filter was set
        const filteredEntities = this.allowedEntityTypes ?
            entityTypes.filter(instance => this.allowedEntityTypes.has(instance.typeName)) :
            entityTypes;
        this.completeEntityTypesList_ =
            filteredEntities.sort(this.entityTypesComparator_);
    }
    /*
     * This comparator purposefully uses sensitivity 'base', not to differentiate
     * between different capitalization or diacritics.
     */
    entityTypesComparator_(a, b) {
        return a.typeNameAsString.localeCompare(b.typeNameAsString, undefined, { sensitivity: 'base' });
    }
    /**
     * This comparator compares the labels alphabetically, and, in case of
     * equality, the sublabels.
     * This comparator purposefully uses sensitivity 'base', not to differentiate
     * between different capitalization or diacritics.
     */
    entityInstancesWithLabelsComparator_(a, b) {
        return (a.entityInstanceLabel + a.entityInstanceSubLabel)
            .localeCompare(b.entityInstanceLabel + b.entityInstanceSubLabel, undefined, { sensitivity: 'base' });
    }
    getMetricEntityTypeString_(type) {
        assert(this.metricEntityTypes);
        const metricString = this.metricEntityTypes[type];
        assert(metricString);
        return metricString;
    }
    /**
     * Handles tapping on the "Add" entity instance button.
     */
    onAddEntityInstanceClick_(e) {
        const addButton = e.target;
        this.$.addMenu.get().showAt(addButton, {
            anchorAlignmentX: AnchorAlignment.BEFORE_END,
            anchorAlignmentY: AnchorAlignment.AFTER_END,
            noOffset: true,
        });
    }
    onAddEntityInstanceFromDropdownClick_(e) {
        e.preventDefault();
        if (this.pageName) {
            this.metricsBrowserProxy_.recordAction(`Settings.YourSavedInfo.${this.pageName}.Add.${this.getMetricEntityTypeString_(e.model.item.typeName)}`);
        }
        // Create a new entity instance with no attribute instances and guid. A guid
        // will be assigned after saving, on the C++ side.
        this.activeEntityInstance_ = {
            type: e.model.item,
            attributeInstances: [],
            guid: '',
            nickname: '',
        };
        this.addOrEditEntityInstanceDialogTitle_ =
            this.activeEntityInstance_.type.addEntityTypeString;
        this.showAddOrEditEntityInstanceDialog_ = true;
        this.$.addMenu.get().close();
    }
    /**
     * Open the action menu.
     */
    onMoreButtonClick_(e) {
        const moreButton = e.target;
        this.activeEntityInstanceGuid_ = e.model.item.guid;
        this.$.actionMenu.get().showAt(moreButton);
    }
    /**
     * Handles tapping on the "Edit" entity instance button in the action menu.
     */
    async onMenuEditEntityInstanceClick_(e) {
        e.preventDefault();
        const instanceWithLabels = this.entityInstances_.find(instance => instance.guid === this.activeEntityInstanceGuid_);
        if (this.pageName && instanceWithLabels) {
            this.metricsBrowserProxy_.recordAction(`Settings.YourSavedInfo.${this.pageName}.Edit.${this.getMetricEntityTypeString_(instanceWithLabels.type.typeName)}`);
        }
        this.activeEntityInstance_ =
            await this.entityDataManager_.getEntityInstanceByGuid(this.activeEntityInstanceGuid_);
        if (!this.activeEntityInstance_) {
            return;
        }
        this.addOrEditEntityInstanceDialogTitle_ =
            this.activeEntityInstance_.type.editEntityTypeString;
        this.showAddOrEditEntityInstanceDialog_ = true;
        this.$.actionMenu.get().close();
    }
    /**
     * Handles tapping on the "Delete" entity instance button in the action menu.
     */
    onMenuRemoveEntityInstanceClick_(e) {
        e.preventDefault();
        const instanceWithLabels = this.entityInstances_.find(instance => instance.guid === this.activeEntityInstanceGuid_);
        if (!instanceWithLabels) {
            return;
        }
        if (this.pageName) {
            this.metricsBrowserProxy_.recordAction(`Settings.YourSavedInfo.${this.pageName}.Delete.${this.getMetricEntityTypeString_(instanceWithLabels.type.typeName)}`);
        }
        this.activeEntityInstanceDeleteTitle_ =
            instanceWithLabels.type.deleteEntityTypeString;
        this.showRemoveEntityInstanceDialog_ = true;
        this.$.actionMenu.get().close();
    }
    onAutofillAiAddOrEditDone_(e) {
        e.stopPropagation();
        // TODO(crbug.com/477845712): Remove this method once
        // `kAutofillAiWalletPrivatePasses` gets launched.
        if (!loadTimeData.getBoolean('enableAutofillAiWalletPrivatePasses')) {
            this.entityDataManager_.addOrUpdateEntityInstance(e.detail);
        }
    }
    onAddOrEditEntityInstanceDialogClose_(e) {
        e.stopPropagation();
        this.showAddOrEditEntityInstanceDialog_ = false;
        this.activeEntityInstance_ = null;
    }
    onRemoveEntityInstanceDialogClose_() {
        const wasDeletionConfirmed = this.shadowRoot
            .querySelector('#removeEntityInstanceDialog').wasConfirmed();
        if (wasDeletionConfirmed) {
            this.entityDataManager_.removeEntityInstance(this.activeEntityInstanceGuid_);
        }
        this.showRemoveEntityInstanceDialog_ = false;
        this.activeEntityInstanceGuid_ = null;
    }
    onRemoteWalletPassesLinkClick_(e) {
        assert(e.model.item.storedInWallet);
        assert(e.model.item.walletEntityUrl);
        OpenWindowProxyImpl.getInstance().openUrl(e.model.item.walletEntityUrl);
    }
    async updateAllowNewEntitiesAddition_() {
        await CrSettingsPrefs.initialized;
        const addressPref = this.getPref('autofill.profile_enabled');
        const autofillAiPref = this.getPref(AiEnterpriseFeaturePrefName.AUTOFILL_AI);
        const meetsAddressPrefRequirement = this.autofillSettingsEnterprisePolicyEnabled_ || addressPref.value;
        const meetsAiPrefRequirement = autofillAiPref.value !== ModelExecutionEnterprisePolicyValue.DISABLE;
        this.allowNewEntitiesAddition_ = this.isNewEntitiesAdditionAllowedByPref_ &&
            this.canEnableOrDisableAutofillAi_ && meetsAddressPrefRequirement &&
            meetsAiPrefRequirement;
    }
    // Refreshes the entity types list when the sync status changes.
    //
    // Updates the list to reflect whether the user is signed in (allowing the
    // creation of entity instances for types stored on the server) or signed
    // out (disallowing it).
    onSyncStatusChanged_(_) {
        this.entityDataManager_.getWritableEntityTypes().then((entityTypes) => {
            this.updateEntityTypesList_(entityTypes);
        });
    }
    get isNewEntitiesAdditionAllowedByPref_() {
        return this.allowNewEntitiesAdditionPref?.value ?? true;
    }
    typeNameToIconName_(name) {
        switch (name) {
            case EntityTypeName.kDriversLicense:
                return 'settings20:id-card';
            case EntityTypeName.kFlightReservation:
                return 'settings20:travel';
            case EntityTypeName.kKnownTravelerNumber:
                return 'privacy20:person-check';
            case EntityTypeName.kNationalIdCard:
                return 'settings20:id-card';
            case EntityTypeName.kOrder:
                return 'settings20:orders';
            case EntityTypeName.kPassport:
                return 'settings20:passport';
            case EntityTypeName.kRedressNumber:
                return 'privacy20:person-check';
            case EntityTypeName.kShipment:
                return 'settings20:local-shipping';
            case EntityTypeName.kVehicle:
                return 'settings20:directions-car';
            default:
                return undefined;
        }
    }
}
customElements.define(SettingsAutofillAiEntriesListElement.is, SettingsAutofillAiEntriesListElement);
