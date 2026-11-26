// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { AsyncScope } from '../../conductor/async-scope.js';
export function veImpressionsUnder(key, children) {
    const result = { impressions: [] };
    for (const child of children || []) {
        for (const impression of child.impressions) {
            result.impressions.push(key + ' > ' + impression);
        }
    }
    return result;
}
export function veClick(ve) {
    return { interaction: `Click: ${ve}` };
}
export function veChange(ve) {
    return { interaction: `Change: ${ve}` };
}
export function veKeyDown(ve) {
    return { interaction: `KeyDown: ${ve}` };
}
export function veResize(ve) {
    return { interaction: `Resize: ${ve}` };
}
export function veImpression(ve, context, children) {
    let key = ve;
    if (context) {
        key += ': ' + context;
    }
    return { impressions: [key, ...veImpressionsUnder(key, children || []).impressions] };
}
function veImpressionForTabHeader(panel) {
    return veImpression('PanelTabHeader', panel);
}
export function veImpressionForMainToolbar(options) {
    const panels = [
        'elements',
        'console',
        'sources',
        'network',
    ];
    if (!options?.dockable) {
        panels.push('security', 'chrome-recorder', 'timeline', 'heap-profiler', 'resources', 'lighthouse');
    }
    if (options?.selectedPanel && !panels.includes(options?.selectedPanel)) {
        panels.push(options.selectedPanel);
    }
    const dockableItems = options?.dockable ?
        [
            veImpression('DropDown', 'more-tabs'),
            veImpression('Toggle', 'emulation.toggle-device-mode'),
            veImpression('Close'),
        ] :
        [];
    return veImpression('Toolbar', 'main', [
        ...panels.map(panel => veImpressionForTabHeader(panel)),
        veImpression('Toggle', 'elements.toggle-element-search'),
        veImpression('Action', 'settings.show'),
        veImpression('DropDown', 'main-menu'),
        ...dockableItems,
    ]);
}
export function veImpressionForElementsPanel(options) {
    return veImpression('Panel', 'elements', [
        veImpression('Toolbar', 'sidebar', [
            veImpressionForTabHeader('styles'),
            veImpressionForTabHeader('computed'),
            veImpressionForTabHeader('elements.layout'),
            ...(options?.dockable ? ['elements.event-listeners', 'elements.dom-breakpoints', 'elements.dom-properties'] : []).map(panel => veImpressionForTabHeader(panel)),
        ]),
        veImpression('ElementsBreadcrumbs', undefined, [veImpression('Item'), veImpression('Item')]),
        veImpression('Tree', 'elements', [
            veImpression('TreeItem'),
            veImpression('TreeItem', undefined, [veImpression('Value', 'tag-name'), veImpression('Expand')]),
            veImpression('TreeItem', undefined, [veImpression('Value', 'tag-name')]),
            veImpression('TreeItem', undefined, [veImpression('Value', 'tag-name')]),
            veImpression('TreeItem'),
        ]),
        ...(options?.expectExistingPanel ? [] : [veImpression('Pane', 'styles', [
                veImpression('Section', 'style-properties', [veImpression('CSSRuleHeader', 'selector')]),
                veImpression('Section', 'style-properties', [
                    veImpression('CSSRuleHeader', 'selector'),
                    veImpression('Tree', undefined, [
                        veImpression('TreeItem', 'display', [/* veImpression('Toggle'), */ veImpression('Key'), veImpression('Value')]),
                        veImpression('TreeItem', 'margin', [
                            veImpression('Key'),
                            veImpression('Expand'),
                            veImpression('Value'),
                            veImpression('Expand'),
                        ]),
                    ]),
                ])
            ]),
            veImpression('ToggleSubpane', 'element-states'),
            veImpression('ToggleSubpane', 'elements-classes'),
            veImpression('Action', 'elements.new-style-rule'),
            veImpression('DropDown', 'rendering-emulations'),
            veImpression('ToggleSubpane', 'computed-styles'),
            veImpression('TextField', 'filter'),
        ]),
    ]);
}
export function veImpressionForDrawerToolbar(options) {
    const panels = options?.selectedPanel ? [options?.selectedPanel] : [];
    return veImpression('Toolbar', 'drawer', [
        veImpressionForTabHeader('console'),
        ...panels.map(panel => veImpressionForTabHeader(panel)),
        veImpression('DropDown', 'more-tabs'),
        veImpression('Close'),
    ]);
}
/**
 * Prints all VE events that haven't been matched by expectVeEvents calls
 * Useful for writing new assertions.
 **/
export async function dumpVeEvents(devToolsPage, label) {
    const events = 
    // @ts-expect-error
    await devToolsPage.evaluate(async () => (await globalThis.getUnmatchedVeEvents()));
    // eslint-disable-next-line no-console
    console.log(label + '\n', events);
}
/**
 * Verifies that VE events contains all the expected events in given order.
 * Unexpected VE events are ignored.
 **/
export async function expectVeEvents(devToolsPage, expectedEvents, root = undefined, asyncScope = new AsyncScope()) {
    collapseConsecutiveImpressions(expectedEvents);
    prependRoot(expectedEvents, root);
    await asyncScope.exec(() => devToolsPage.evaluate(
    // @ts-expect-error
    async (expectedEvents) => await globalThis.expectVeEvents(expectedEvents), expectedEvents), `Waiting for VE events: ${JSON.stringify(expectedEvents)}`);
}
function collapseConsecutiveImpressions(events) {
    let group = null;
    for (let i = 0; i < events.length; ++i) {
        const event = events[i];
        // We skip resetting the impression group for Resize interactions that could
        // be initiated by the rendering and not an actual test action.
        if ('interaction' in event && event.interaction !== 'Resize') {
            group = null;
        }
        if ('impressions' in event) {
            if (!group) {
                group = event;
            }
            else {
                group.impressions.push(...event.impressions);
                events.splice(i, 1);
                --i;
            }
        }
    }
}
function prependRoot(events, root) {
    if (!root) {
        return;
    }
    for (const event of events) {
        if ('interaction' in event) {
            if (event.interaction.endsWith(': ')) {
                event.interaction = event.interaction + root;
            }
            else {
                event.interaction = event.interaction.replace(': ', ': ' + root + ' > ');
            }
        }
        if ('impressions' in event) {
            event.impressions = event.impressions.map(i => root + ' > ' + i);
        }
    }
}
//# sourceMappingURL=visual-logging-helpers.js.map