import type * as childProcess from 'node:child_process';
import type * as AiAssistance from '../../../front_end/panels/ai_assistance/ai_assistance.js';
import type { DevToolsPage } from '../../e2e/shared/DevToolsPage.js';
export declare const TASK_TEXTPROTO = "task.textproto";
export type AiAssistanceContext = NonNullable<AiAssistance.ExternalHandler.ExternalAIRequestOptions['context']>;
export interface EvalTaskConfig {
    /** The folder name of the base app inside `eval_data/base-apps/`. */
    baseApp: string;
    /**
     * The ordered sequence of shell commands to set up and run the app
     * (e.g. `["npm install", "npm run dev"]`). Commands are executed sequentially
     * one by one in order, and the final command starts the application server.
     */
    taskEntryPoint: string[];
    /** The initial URL to navigate to for the evaluation. */
    initialUrl?: string;
}
export interface RunningEvalApp {
    process: childProcess.ChildProcess;
    config: EvalTaskConfig;
    getOutput: () => string;
    waitForOutput: (pattern: RegExp | string, timeoutMs?: number) => Promise<string>;
}
/**
 * Parses the `base_app`, `task_entry_point`, and optional `initial_url` fields from a `task.textproto` file.
 */
export declare function parseTaskTextproto(content: string): EvalTaskConfig;
/**
 * Waits for a process's output to match a given pattern using stream events.
 * Throws if the process exits prematurely or if the timeout is exceeded.
 */
export declare function waitForProcessOutput(child: childProcess.ChildProcess, getOutput: () => string, pattern: RegExp | string, timeoutMs?: number): Promise<string>;
/**
 * Stops a spawned process group by sending SIGTERM, with a fallback to SIGKILL.
 */
export declare function stopProcess(child?: childProcess.ChildProcess): Promise<void>;
/**
 * Stops a running eval app and its child process group.
 */
export declare function stopEvalApp(app: RunningEvalApp): Promise<void>;
/**
 * Filters the Network log and selects the specified request.
 * Filtering is required because the grid is virtualized: off-screen requests
 * are not in the DOM and cannot be selected by name alone.
 */
export declare function selectNetworkRequest(devToolsPage: DevToolsPage, requestName: string): Promise<void>;
/**
 * Finds and selects the specified context in DevTools so that it is set
 * as the active flavor (e.g. in UI.Context.Context) for AI evaluation.
 */
export declare function findAndSetContext(devToolsPage: DevToolsPage, context: AiAssistanceContext): Promise<void>;
