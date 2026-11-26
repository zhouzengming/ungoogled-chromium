import type { DevToolsPage } from '../shared/DevToolsPage.js';
/**
 * Inspects a node via the DevTools Console.
 */
export declare function inspectNode(devToolsPage: DevToolsPage, selector: string): Promise<void>;
/**
 * Dismisses the AI Assistance opt-in onboarding dialog if it is present.
 */
export declare function dismissOptInDialogIfPresent(devToolsPage: DevToolsPage): Promise<boolean>;
/**
 * Types a query into the AI Assistance chat input.
 */
export declare function typeQuery(devtoolsPage: DevToolsPage, query: string): Promise<void>;
/**
 * Gets AI structured logs from localStorage after waiting for a response to complete.
 */
export declare function getAiLogs(devToolsPage: DevToolsPage): Promise<Array<Record<string, unknown>> | null>;
