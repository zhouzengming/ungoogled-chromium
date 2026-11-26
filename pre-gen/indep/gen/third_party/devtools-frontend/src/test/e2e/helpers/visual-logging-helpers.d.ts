import { AsyncScope } from '../../conductor/async-scope.js';
import type { DevToolsPage } from '../shared/DevToolsPage.js';
/** Corresponds to the type in front_end/ui/visual_logging/Debugging.ts **/
interface TestImpressionLogEntry {
    impressions: string[];
}
type TestLogEntry = TestImpressionLogEntry | {
    interaction: string;
};
export declare function veImpressionsUnder(key: string, children: TestImpressionLogEntry[]): TestImpressionLogEntry;
export declare function veClick(ve: string): TestLogEntry;
export declare function veChange(ve: string): TestLogEntry;
export declare function veKeyDown(ve: string): TestLogEntry;
export declare function veResize(ve: string): TestLogEntry;
export declare function veImpression(ve: string, context?: string, children?: TestImpressionLogEntry[]): {
    impressions: string[];
};
export declare function veImpressionForMainToolbar(options?: {
    selectedPanel?: string;
    expectClosedPanels?: string[];
    dockable?: boolean;
}): {
    impressions: string[];
};
export declare function veImpressionForElementsPanel(options?: {
    dockable?: boolean;
    expectExistingPanel?: boolean;
}): {
    impressions: string[];
};
export declare function veImpressionForDrawerToolbar(options?: {
    selectedPanel?: string;
}): {
    impressions: string[];
};
/**
 * Prints all VE events that haven't been matched by expectVeEvents calls
 * Useful for writing new assertions.
 **/
export declare function dumpVeEvents(devToolsPage: DevToolsPage, label: string): Promise<void>;
/**
 * Verifies that VE events contains all the expected events in given order.
 * Unexpected VE events are ignored.
 **/
export declare function expectVeEvents(devToolsPage: DevToolsPage, expectedEvents: TestLogEntry[], root?: string | undefined, asyncScope?: AsyncScope): Promise<void>;
export {};
