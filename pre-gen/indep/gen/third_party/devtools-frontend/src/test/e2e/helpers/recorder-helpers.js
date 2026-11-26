// Copyright 2023 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { assert } from 'chai';
import { openCommandMenu } from './quick_open-helpers.js';
const RECORDER_PANEL_TAG_NAME = 'devtools-recorder-panel';
const TEST_RECORDING_NAME = 'New Recording';
export async function record(devToolsPage, inspectedPage) {
    await devToolsPage.bringToFront();
    await devToolsPage.waitFor('.settings');
    await inspectedPage.bringToFront();
    const element = await inspectedPage.waitForSelector('a[href="recorder2.html"]');
    await element?.click();
    await devToolsPage.bringToFront();
}
export async function getRecordingPanel(devToolsPage) {
    return await devToolsPage.waitFor(RECORDER_PANEL_TAG_NAME);
}
export async function onRecordingStateChanged(devToolsPage) {
    const view = await getRecordingPanel(devToolsPage);
    return await view.evaluate(el => {
        return new Promise(resolve => {
            el.addEventListener('recordingstatechanged', (event) => resolve(event.recording), { once: true });
        });
    });
}
export async function onRecorderAttachedToTarget(devToolsPage) {
    return await devToolsPage.evaluate(() => {
        return new Promise(resolve => {
            window.addEventListener('recorderAttachedToTarget', resolve, {
                once: true,
            });
        });
    });
}
export async function onReplayFinished(devToolsPage) {
    const view = await getRecordingPanel(devToolsPage);
    return await view.evaluate(el => {
        return new Promise(resolve => {
            el.addEventListener('replayfinished', resolve, { once: true });
        });
    });
}
export async function enableUntrustedEventMode(devToolsPage) {
    await devToolsPage.evaluate(`(async () => {
    // TODO: have an explicit UI setting or perhaps a special event to configure this
    // instead of having a global setting.
    const Common = await import('./core/common/common.js');
    Common.Settings.Settings.instance().createSetting('untrusted-recorder-events', true);
  })()`);
}
export async function enableAndOpenRecorderPanel(devToolsPage, inspectedPage, path) {
    await inspectedPage.goToResource(path);
    await openRecorderPanel(devToolsPage);
}
async function createRecording(devToolsPage, name, selectorAttribute) {
    const newRecordingButton = await devToolsPage.waitForAria('Create recording');
    await newRecordingButton.click();
    const input = await devToolsPage.waitForAria('RECORDING NAME');
    await input.type(name);
    if (selectorAttribute) {
        const input = await devToolsPage.waitForAria('SELECTOR ATTRIBUTE Learn more');
        await input.type(selectorAttribute);
    }
}
export async function createAndStartRecording(devToolsPage, name, selectorAttribute) {
    await createRecording(devToolsPage, name ?? TEST_RECORDING_NAME, selectorAttribute);
    const onRecordingStarted = onRecordingStateChanged(devToolsPage);
    await devToolsPage.click('.control-button');
    await devToolsPage.waitFor('.recording-view');
    await onRecordingStarted;
}
export async function changeNetworkConditions(devToolsPage, condition) {
    await openCommandMenu(devToolsPage);
    await devToolsPage.typeText('Show Network');
    await devToolsPage.pressKey('Enter');
    await devToolsPage.waitFor('select[aria-label="Throttling"]');
    await devToolsPage.page.select('pierce/select[aria-label="Throttling"]', condition);
}
export async function openRecorderPanel(devToolsPage) {
    await openCommandMenu(devToolsPage);
    await devToolsPage.typeText('Show Recorder');
    await devToolsPage.pressKey('Enter');
    await devToolsPage.waitFor(RECORDER_PANEL_TAG_NAME);
}
export async function startRecording(devToolsPage, inspectedPage, path, options = {
    networkCondition: '',
    untrustedEvents: false,
}) {
    await devToolsPage.bringToFront();
    if (options.networkCondition) {
        await changeNetworkConditions(devToolsPage, options.networkCondition);
    }
    await enableAndOpenRecorderPanel(devToolsPage, inspectedPage, path);
    if (options.untrustedEvents) {
        await enableUntrustedEventMode(devToolsPage);
    }
    await createAndStartRecording(devToolsPage, TEST_RECORDING_NAME, options.selectorAttribute);
}
export async function stopRecording(devToolsPage) {
    await devToolsPage.bringToFront();
    await devToolsPage.raf();
    const onRecordingStopped = onRecordingStateChanged(devToolsPage);
    await devToolsPage.click('aria/End recording');
    return await onRecordingStopped;
}
export const processAndVerifyBaseRecording = (recording, options = {}) => {
    const { offsets = false, expectCommon = true, resource = 'recorder/recorder.html', } = options;
    let value = JSON.stringify(recording)
        .replaceAll(/https:\/\/localhost:\d+/g, 'https://localhost:<test-port>')
        .replaceAll(/https:\/\/devtools.oopif.test:\d+/g, 'https://devtools.oopif.test:<test-port>');
    value = value.replaceAll('\u200b', '');
    if (!offsets) {
        value = value.replaceAll(/,?"(?:offsetY|offsetX)":[0-9]+(?:\.[0-9]+)?/g, '');
    }
    const parsed = JSON.parse(value.trim());
    if (expectCommon) {
        assert.strictEqual(parsed.title, 'New Recording');
        delete parsed.title;
        assert.deepEqual(parsed.steps[0], {
            type: 'setViewport',
            width: 1280,
            height: 720,
            deviceScaleFactor: 1,
            isMobile: false,
            hasTouch: false,
            isLandscape: false,
        });
        assert.deepEqual(parsed.steps[1], {
            type: 'navigate',
            url: `https://localhost:<test-port>/test/e2e/resources/${resource}`,
            assertedEvents: [{
                    type: 'navigation',
                    url: `https://localhost:<test-port>/test/e2e/resources/${resource}`,
                    title: '',
                }],
        });
        parsed.steps = parsed.steps.slice(2);
    }
    return parsed;
};
async function setCode(devToolsPage, flow) {
    const view = await getRecordingPanel(devToolsPage);
    await view.evaluate(async (el, flow) => {
        const promise = new Promise(resolve => el.addEventListener('setrecordingfinished', resolve, { once: true }));
        el.dispatchEvent(new CustomEvent('setrecording', { detail: flow }));
        await promise;
    }, flow);
}
export async function clickSelectButtonItem(devToolsPage, itemLabel, root) {
    const selectMenu = await devToolsPage.waitFor(root);
    const selectMenuButton = await devToolsPage.waitFor('select', selectMenu);
    void (await selectMenuButton.toElement('select')).select(itemLabel);
    await devToolsPage.click('devtools-button', { root: selectMenu });
}
export async function setupRecorderWithScript(devToolsPage, inspectedPage, script, path = 'recorder/recorder.html') {
    await enableAndOpenRecorderPanel(devToolsPage, inspectedPage, path);
    await createAndStartRecording(devToolsPage, script.title, undefined);
    await stopRecording(devToolsPage);
    await setCode(devToolsPage, JSON.stringify(script));
}
export async function setupRecorderWithScriptAndReplay(devToolsPage, inspectedPage, script, path = 'recorder/recorder.html') {
    await setupRecorderWithScript(devToolsPage, inspectedPage, script, path);
    const onceFinished = onReplayFinished(devToolsPage);
    await clickSelectButtonItem(devToolsPage, 'Normal (Default)', '.select-button');
    await onceFinished;
}
export async function getCurrentRecording(devToolsPage) {
    await devToolsPage.bringToFront();
    const panel = await devToolsPage.$(RECORDER_PANEL_TAG_NAME);
    const recording = (await panel?.evaluate(async (el) => {
        const path = './ui/legacy/legacy.js';
        const UI = await import(path);
        const widget = UI.Widget.Widget.get(el);
        if (!widget) {
            throw new Error('Could not find Widget for panel element');
        }
        return JSON.stringify(widget.getUserFlow());
    }));
    return JSON.parse(recording ?? '');
}
export async function startOrStopRecordingShortcut(devToolsPage, inspectedPage, execute = 'devToolsPage') {
    const executeOn = execute === 'devToolsPage' ? devToolsPage : inspectedPage;
    const onRecordingStarted = onRecordingStateChanged(devToolsPage);
    await executeOn.bringToFront();
    await executeOn.pressKey('e', { control: true });
    await devToolsPage.waitFor('.recording-view');
    return await onRecordingStarted;
}
export async function fillCreateRecordingForm(devToolsPage, inspectedPage, path) {
    await enableAndOpenRecorderPanel(devToolsPage, inspectedPage, path);
    await createRecording(devToolsPage, TEST_RECORDING_NAME, undefined);
}
export async function startRecordingViaShortcut(devToolsPage, inspectedPage, path) {
    await enableAndOpenRecorderPanel(devToolsPage, inspectedPage, path);
    await startOrStopRecordingShortcut(devToolsPage, inspectedPage, 'devToolsPage');
}
export async function replayShortcut(devToolsPage) {
    await devToolsPage.bringToFront();
    await devToolsPage.pressKey('Enter', { control: true });
}
export async function toggleCodeView(devToolsPage) {
    await devToolsPage.bringToFront();
    await devToolsPage.pressKey('b', { control: true });
    await devToolsPage.drainTaskQueue();
}
//# sourceMappingURL=recorder-helpers.js.map