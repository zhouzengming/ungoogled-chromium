// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { html } from '//resources/lit/v3_0/lit.rollup.js';
import { RestartType } from '../relaunch_mixin_lit.js';
export function getHtml() {
    // clang-format off
    return html `<!--_html_template_start_-->
<settings-section page-title="$i18n{aboutPageTitle}">
  <div class="cr-row two-line first">
    <img id="productLogo" @click="${this.onProductLogoClick_}"
        srcset="chrome://theme/current-channel-logo@1x 1x,
                chrome://theme/current-channel-logo@2x 2x"
        alt="$i18n{aboutProductLogoAlt}"
        role="presentation">
    <div class="product-title">$i18n{aboutProductTitle}</div>
  </div>
  <div class="cr-row two-line">
    <!-- Set the icon from the iconset (when it's obsolete/EOL and
      when update is done) or set the src (when it's updating). -->

    <div class="flex cr-padded-text">

      <div class="secondary">$i18n{aboutBrowserVersion}</div>
    </div>

    <div class="separator" ?hidden="${!this.showButtonContainer_}"></div>
    <span id="buttonContainer" ?hidden="${!this.showButtonContainer_}">
      <cr-button id="relaunch" ?hidden="${!this.showRelaunch_}"
          @click="${this.onRelaunchClick_}">
        $i18n{aboutRelaunch}
      </cr-button>
    </span>

  </div>


  <cr-link-row class="hr" @click="${this.onManagementPageClick_}"
      start-icon="${this.managedByIcon_}" label="$i18n{managementPage}"
      role-description="$i18n{subpageArrowRoleDescription}"
      ?hidden="${!this.isManaged_}"></cr-link-row>
</settings-section>

<settings-section>
  <div class="info-sections">
    <div class="info-section">
      <div class="secondary">$i18n{aboutProductTitle}</div>
      <div class="secondary">$i18n{aboutProductCopyright}</div>
    </div>

    <div class="info-section">
      <div class="secondary">$i18nRaw{aboutProductLicense}</div>
    </div>


    ${this.shouldShowRelaunchDialog ? html `
      <relaunch-confirmation-dialog .restartType="${RestartType.RELAUNCH}"
          @close="${this.onRelaunchDialogClose}"></relaunch-confirmation-dialog>
    ` : ''}

  </div>
</settings-section>
<!--_html_template_end_-->`;
    // clang-format on
}
