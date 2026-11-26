// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { html } from '//resources/lit/v3_0/lit.rollup.js';
export function getHtml() {
    return html `
<h3>Browser Actuator Internals</h3>

<div class="card">
  <h4>Downstream Transport Connection</h4>
  <p>
    <strong>Status:</strong>
    <span class="badge disconnected">
      Disconnected
    </span>
  </p>
</div>`;
}
