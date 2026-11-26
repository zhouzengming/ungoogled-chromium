// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import '//resources/cr_elements/cr_action_menu/cr_action_menu.js';
import '//resources/cr_elements/cr_icon/cr_icon.js';
import '//resources/cr_elements/icons.html.js';
import { SearchboxBrowserProxy } from '//resources/cr_components/searchbox/searchbox_browser_proxy.js';
import { AnchorAlignment } from '//resources/cr_elements/cr_action_menu/cr_action_menu.js';
import { I18nMixinLit } from '//resources/cr_elements/i18n_mixin_lit.js';
import { loadTimeData } from '//resources/js/load_time_data.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { getCss } from './profile_icon.css.js';
import { getHtml } from './profile_icon.html.js';
const OmniboxEverywhereProfileIconElementBase = I18nMixinLit(CrLitElement);
export class OmniboxEverywhereProfileIconElement extends OmniboxEverywhereProfileIconElementBase {
    static get is() {
        return 'omnibox-everywhere-profile-icon';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            isEnterpriseProfile_: {
                type: Boolean,
                reflect: true,
                attribute: 'is-enterprise-profile',
            },
            profileAvatarUrl_: { type: String },
            profileName_: { type: String },
            profileEmail_: { type: String },
            profilePickerEnabled_: { type: Boolean },
        };
    }
    #isEnterpriseProfile__accessor_storage = loadTimeData.getBoolean('isEnterpriseProfile');
    get isEnterpriseProfile_() { return this.#isEnterpriseProfile__accessor_storage; }
    set isEnterpriseProfile_(value) { this.#isEnterpriseProfile__accessor_storage = value; }
    #profileAvatarUrl__accessor_storage = loadTimeData.getString('profileAvatarUrl');
    get profileAvatarUrl_() { return this.#profileAvatarUrl__accessor_storage; }
    set profileAvatarUrl_(value) { this.#profileAvatarUrl__accessor_storage = value; }
    #profileName__accessor_storage = loadTimeData.getString('profileName');
    get profileName_() { return this.#profileName__accessor_storage; }
    set profileName_(value) { this.#profileName__accessor_storage = value; }
    #profileEmail__accessor_storage = loadTimeData.getString('profileEmail');
    get profileEmail_() { return this.#profileEmail__accessor_storage; }
    set profileEmail_(value) { this.#profileEmail__accessor_storage = value; }
    #profilePickerEnabled__accessor_storage = loadTimeData.getBoolean('omniboxEverywhereProfilePickerEnabled');
    get profilePickerEnabled_() { return this.#profilePickerEnabled__accessor_storage; }
    set profilePickerEnabled_(value) { this.#profilePickerEnabled__accessor_storage = value; }
    searchboxHandler_ = SearchboxBrowserProxy.getInstance().handler;
    callbackRouter_ = SearchboxBrowserProxy.getInstance().callbackRouter;
    updateProfileInfoListenerId_ = null;
    connectedCallback() {
        super.connectedCallback();
        this.updateProfileInfoListenerId_ =
            this.callbackRouter_.updateProfileInfo.addListener((avatarUrl, name, email) => {
                this.profileAvatarUrl_ = avatarUrl;
                this.profileName_ = name;
                this.profileEmail_ = email;
            });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.updateProfileInfoListenerId_ !== null) {
            this.callbackRouter_.removeListener(this.updateProfileInfoListenerId_);
            this.updateProfileInfoListenerId_ = null;
        }
    }
    getProfileTooltip_() {
        return [
            this.i18n('profileTooltipHeader'),
            this.profileName_,
            this.profileEmail_,
        ].filter(Boolean)
            .join('\n');
    }
    getProfileAriaLabel_() {
        return [
            this.i18n('profileTooltipHeader'),
            this.profileName_,
            this.profileEmail_,
        ].filter(Boolean)
            .join(' ');
    }
    onProfileIconClick_() {
        if (!this.profilePickerEnabled_) {
            return;
        }
        const anchor = this.shadowRoot?.querySelector('#profileContainer');
        if (anchor && this.$.profileMenu) {
            this.$.profileMenu.showAt(anchor, {
                anchorAlignmentX: AnchorAlignment.BEFORE_END,
                anchorAlignmentY: AnchorAlignment.AFTER_END,
            });
        }
    }
    onSwitchProfileClick_() {
        if (this.$.profileMenu) {
            this.$.profileMenu.close();
        }
        this.searchboxHandler_.openProfilePicker();
    }
}
customElements.define(OmniboxEverywhereProfileIconElement.is, OmniboxEverywhereProfileIconElement);
