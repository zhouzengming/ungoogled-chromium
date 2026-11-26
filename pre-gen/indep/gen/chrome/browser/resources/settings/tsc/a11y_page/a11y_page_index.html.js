// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { html } from '//resources/lit/v3_0/lit.rollup.js';
export function getHtml() {
    // clang-format off
    return html `<!--_html_template_start_-->
<cr-view-manager id="viewManager" class="cr-centered-card-container"
    ?show-all="${this.shouldShowAll}">
  <settings-a11y-page slot="view" id="parent"
      route-path="${this.routes_.ACCESSIBILITY.path}">
  </settings-a11y-page>


  <settings-captions-page slot="view" id="captions" data-parent-view-id="parent"
      route-path="${this.routes_.CAPTIONS.path}">
  </settings-captions-page>

</cr-view-manager>
<!--_html_template_end_-->`;
    // clang-format on
}
