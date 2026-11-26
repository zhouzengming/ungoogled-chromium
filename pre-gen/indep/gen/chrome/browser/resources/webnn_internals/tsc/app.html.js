// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { html } from '//resources/lit/v3_0/lit.rollup.js';
export function getHtml() {
    // clang-format off
    return html `<!--_html_template_start_-->
<h1>WebNN Internals</h1>
<cr-tabs id="tabs" .tabNames="${['Active Contexts', 'Info', 'ML Graph Dump']}"
    .selected="${this.selectedTabIndex_}"
    @selected-changed="${this.onSelectedChanged_}">
</cr-tabs>
<cr-page-selector .selected="${this.selectedTabIndex_}">
  <webnn-internals-contexts-viewer class="tab-contents">
  </webnn-internals-contexts-viewer>
  <webnn-internals-info-page class="tab-contents">
  </webnn-internals-info-page>


  <div class="text">WebNN graph dump is only supported on debug builds.</div>

</cr-page-selector>
<!--_html_template_end_-->`;
    // clang-format on
}
