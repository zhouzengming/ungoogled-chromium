// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
export async function setCustomOrientation(devtoolsPage) {
    const dropDown = await devtoolsPage.waitFor('.orientation-fields select');
    void (await dropDown.toElement('select')).select('custom');
}
export async function getInputFieldValue(field) {
    return await field.evaluate(input => input.value);
}
export async function getOrientationInputs(devtoolsPage) {
    return await devtoolsPage.waitForMany('.orientation-axis-input-container input', 3);
}
export async function getOrientationValues(devtoolsPage) {
    return await Promise.all((await getOrientationInputs(devtoolsPage)).map(i => i.evaluate(input => parseInt(input.value, 10))));
}
//# sourceMappingURL=helpers.js.map