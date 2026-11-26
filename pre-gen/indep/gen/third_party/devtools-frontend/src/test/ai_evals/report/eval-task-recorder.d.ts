import type { EvalLogger } from './eval-logger.js';
import { type TaskStatus } from './gcs-upload.js';
import { type Trajectory } from './trajectory-builder.js';
export interface FinalizeTaskOptions {
    runId: string;
    taskId: string;
    label: string;
    trajectory: Trajectory;
    outputDir: string;
    durationSeconds: number;
    logger: EvalLogger;
    taskStatuses: TaskStatus[];
    hasError?: boolean;
    customScore?: number;
}
export interface HandleTaskFailureOptions {
    runId: string;
    taskId: string;
    phase: 'Preparation' | 'Execution';
    durationSeconds: number;
    logger: EvalLogger;
    taskStatuses: TaskStatus[];
}
/**
 * Records a task failure to GCS (`eval_task_completed.json` + `.marker`) and in-memory `taskStatuses`.
 */
export declare function recordTaskFailure(taskId: string, runId: string, durationSeconds: number, taskStatuses: TaskStatus[]): void;
/**
 * Handles a task failure during preparation or execution.
 * Logs the failure and immediately uploads diagnostic logs
 * (`agent_logs/agent.log` and `agent_logs/agent_stderr.log`) before sealing `eval_task_completed.marker`.
 */
export declare function handleTaskFailure(options: HandleTaskFailureOptions): void;
/**
 * Uploads every per-task artifact to GCS. Returns true only if all of them
 * were uploaded successfully.
 */
export declare function uploadTaskArtifacts(runId: string, taskId: string, logger: EvalLogger, trajectory: Trajectory, evalOutputPath: string): boolean;
/**
 * Derives the task score and status and reports the completion both to GCS and
 * to the in-memory run summary (`taskStatuses`).
 */
export declare function recordTaskCompletion(taskId: string, runId: string, durationSeconds: number, taskStatuses: TaskStatus[], allUploadsSucceeded: boolean, hasError?: boolean, customScore?: number): void;
/**
 * Exports the task trajectory to disk (`outputDir`), uploads all task artifacts,
 * and seals `eval_task_completed.marker`.
 * Returns the path of the exported `.eval.json` file.
 */
export declare function finalizeEvalTask(options: FinalizeTaskOptions): string;
