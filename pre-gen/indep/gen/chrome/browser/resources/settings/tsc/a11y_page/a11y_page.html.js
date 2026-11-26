// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { html } from '//resources/lit/v3_0/lit.rollup.js';
import { ToastAlertLevel } from './a11y_page.js';
export function getHtml() {
    // clang-format off
    return html `<!--_html_template_start_-->
    <settings-section page-title="$i18n{a11yPageTitle}">
      <div route-path="default">





          <cr-link-row id="captions"
              class="hr"
              label="$i18n{captionsTitle}"
              @click="${this.onCaptionsClick_}"
              role-description="$i18n{subpageArrowRoleDescription}">
          </cr-link-row>



        <settings-toggle-button
            class="hr"
            pref-key="settings.a11y.focus_highlight"
            @setting-boolean-control-change="${this.onFocusHighlightSettingBooleanControlChange_}"
            label="$i18n{focusHighlightLabel}">
        </settings-toggle-button>
        <settings-toggle-button
            class="hr"
            pref-key="settings.a11y.caretbrowsing.enabled"
            @change="${this.onA11yCaretBrowsingChange_}"
            label="$i18n{caretBrowsingTitle}"
            sub-label="$i18n{caretBrowsingSubtitle}">
        </settings-toggle-button>

        <settings-toggle-button
            class="hr"
            ?hidden="${!this.hasScreenReader_}"
            pref-key="settings.a11y.enable_accessibility_image_labels"
            @change="${this.onA11yImageLabelsChange_}"
            label="$i18n{accessibleImageLabelsTitle}"
            sub-label="$i18n{accessibleImageLabelsSubtitle}">
        </settings-toggle-button>
        ${this.showAxTreeFixingSection_ ? html `
          <settings-toggle-button id="axTreeFixing"
              class="hr"
              pref-key="settings.a11y.enable_ax_tree_fixing"
              label="$i18n{axTreeFixingTitle}"
              sub-label="$i18n{axTreeFixingSubtitle}">
          </settings-toggle-button>
        ` : ''}

        ${this.showAxAnnotationsSection_ ? html `
          <settings-ax-annotations-section
              id="AxAnnotationsSection">
          </settings-ax-annotations-section>
        ` : ''}


        <settings-toggle-button
            class="hr"
            pref-key="settings.a11y.overscroll_history_navigation"
            @change="${this.onOverscrollHistoryNavigationChange_}"
            label="$i18n{overscrollHistoryNavigationTitle}"
            sub-label="$i18n{overscrollHistoryNavigationSubtitle}">
        </settings-toggle-button>



        <settings-toggle-button class="hr" id="toastToggle"
            pref-key="settings.toast.alert_level"
            .numericUncheckedValues="${this.numericUncheckedToastAlertValues_}"
            .numericCheckedValue="${ToastAlertLevel.ALL}"
            @change="${this.onToastAlertLevelChange_}"
            label="$i18n{toastAlertLevelTitle}"
            sub-label="$i18n{toastAlertLevelDescription}">
        </settings-toggle-button>

      </div>
    </settings-section>
<!--_html_template_end_-->`;
    // clang-format on
}
