// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { assert } from 'chai';
import { openPanelViaMoreTools } from '../helpers/settings-helpers.js';
async function expectCpuPerformance(expectedTier, devToolsPage, inspectedPage) {
    await devToolsPage.waitForFunction(async () => {
        const currentTier = await inspectedPage.evaluate(() => navigator.cpuPerformance);
        return currentTier === expectedTier;
    });
}
describe('cpuPerformance emulation on Sensors panel', () => {
    it('can emulate navigator.cpuPerformance', async ({ devToolsPage, inspectedPage }) => {
        await inspectedPage.goToResource('empty.html');
        const baselineCpuPerformance = await inspectedPage.evaluate(() => navigator.cpuPerformance);
        assert.isNumber(baselineCpuPerformance);
        // Open the Sensors panel.
        await openPanelViaMoreTools(devToolsPage, 'Sensors');
        // Select an explicit tier override, guaranteed to differ from the baseline.
        const targetTierName = baselineCpuPerformance === 1 ? 'mid' : 'low';
        const targetTierNumber = baselineCpuPerformance === 1 ? 2 : 1;
        // Wait for the CPU Performance dropdown to load.
        const select = await devToolsPage.waitFor('.cpu-performance-section select');
        // Select the override and verify the tier.
        await select.select(targetTierName);
        await expectCpuPerformance(targetTierNumber, devToolsPage, inspectedPage);
        // Reset the setting to "No override" and verify again.
        await select.select('no-override');
        await expectCpuPerformance(baselineCpuPerformance, devToolsPage, inspectedPage);
    });
});
//# sourceMappingURL=emulate-cpu-performance.test.js.map