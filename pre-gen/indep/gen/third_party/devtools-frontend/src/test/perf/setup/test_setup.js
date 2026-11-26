// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { clearResults, collectMeasurements, writeReport } from '../report/report.js';
export async function mochaGlobalTeardown() {
    collectMeasurements();
    writeReport();
}
export async function mochaGlobalSetup() {
    clearResults();
}
//# sourceMappingURL=test_setup.js.map