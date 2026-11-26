export declare const BUCKET = "gleam-eval-cd4h-nonprod";
export declare const PROJECT_ID = "ai_evals";
export declare const Markers: {
    readonly RUN_STARTED: "run_started.marker";
    readonly TASK_COMPLETED: "eval_task_completed.marker";
    readonly RUN_COMPLETED: "run_completed.marker";
};
export type Markers = (typeof Markers)[keyof typeof Markers];
export type MarkerType = Markers;
/**
 * Note on omitted protocol artifacts:
 * - verification/diff.patch: Omitted because evals evaluate in-browser
 *   assistance and do not modify files on disk.
 * - post_eval_task_dir/: Omitted because tasks do not modify an on-disk
 *   workspace (unlike coding agent benchmarks such as CD4A).
 */
export declare const TaskOutputFile: {
    readonly TRAJECTORY: "trajectory.json";
    readonly EVAL_RESULT: "eval_result.json";
    readonly AGENT_LOG: "agent_logs/agent.log";
    readonly CHAT_LOG: "agent_logs/chat_log.txt";
    readonly AGENT_STDERR: "agent_logs/agent_stderr.log";
    readonly GRADER_LOG: "grader_output/grader.log";
};
export type TaskOutputFile = (typeof TaskOutputFile)[keyof typeof TaskOutputFile];
export interface RunStartedPayload {
    project: string;
    runId: string;
    model: string;
    agent: string;
    startTime: string;
    status: string;
}
export interface TaskCompletedPayload {
    taskId: string;
    runId: string;
    /** Execution status: 'PASSED' on success, 'FAILED' on error or timeout. */
    status: string;
    /** Task evaluation score from 0.0 (failure) to 1.0 (success). Defaults to 1.0 for completed tasks without inline assertions. */
    score: number;
    durationSeconds: number;
    tokens?: Record<string, unknown>;
}
export interface RunCompletedPayload {
    project: string;
    runId: string;
    status: string;
    startTime: string;
    endTime: string;
    totalTasks: number;
    passedTasks: number;
    failedTasks: number;
}
/** Record of a completed task's execution outcome and score. Each task corresponds to an evaluation trajectory. */
export interface TaskStatus {
    taskId: string;
    status: string;
    score: number;
}
/**
 * Generates a run ID formatted as YYYY-MM-DD-HHmmss-xxxx-xxxxxxx
 * (e.g., 2026-08-25-134619-c0c1-8f25f69) for a suite execution.
 */
export declare function generateRunId(): string;
/**
 * Formats a run-level GCS destination URI (e.g., gs://bucket/ai_evals/runs/<runId>/<fileName>).
 */
export declare function formatGCSRunDestination(runId: string, destinationFileName: string): string;
/**
 * Formats a task-level GCS destination URI (e.g., gs://bucket/ai_evals/runs/<runId>/tasks/<taskId>/output/<fileName>).
 */
export declare function formatGCSTaskDestination(runId: string, taskId: string, destinationFileName: string): string;
/**
 * Resolves the appropriate Content-Type header with UTF-8 charset based on the file extension.
 */
export declare function getContentType(filePath: string): string;
/**
 * Uploads an existing local file to a task-level GCS destination
 * (e.g. tasks/<taskId>/output/<destinationFileName>).
 */
export declare function uploadTaskFile(runId: string, taskId: string, destinationFileName: TaskOutputFile | string, localFilePath: string): boolean;
/**
 * Stages string content into a temporary directory file, uploads it to GCS,
 * and guarantees immediate cleanup in a finally block.
 */
export declare function uploadTemporaryContentToGCS(content: string, destination: string, contentType?: string): boolean;
/**
 * Uploads a 0-byte marker file to GCS for run-level or task-level commit signals.
 * taskId is optional because run-level markers (e.g. RUN_STARTED, RUN_COMPLETED)
 * reside directly under the run root, whereas task-level markers require a taskId.
 */
export declare function uploadMarker(runId: string, marker: MarkerType, taskId?: string): boolean;
/**
 * Emits run_started.json and immediately uploads run_started.marker.
 */
export declare function uploadRunStarted(payload: RunStartedPayload): boolean;
/**
 * Uploads text/log content directly to a task-level GCS destination
 * (e.g. tasks/<taskId>/output/<destinationPath>).
 * Used for task artifacts such as:
 *   - agent_logs/agent.log
 *   - agent_logs/chat_log.txt
 *   - agent_logs/agent_stderr.log
 *   - grader_output/grader.log
 * Staged in a temporary directory and cleaned up after upload.
 * Must be called during Phase 2 before eval_task_completed.marker is uploaded.
 */
export declare function uploadTaskContent(runId: string, taskId: string, destinationPath: TaskOutputFile, content: string): boolean;
/**
 * Emits eval_task_completed.json and immediately uploads eval_task_completed.marker.
 */
export declare function uploadTaskCompleted(payload: TaskCompletedPayload): boolean;
/**
 * Uploads the master evaluation run log to <run_id>/eval_run.log in GCS.
 * Staged in a temporary directory and cleaned up after upload.
 * Must be called during Phase 3 before run_completed.marker is uploaded.
 */
export declare function uploadRunLog(runId: string, logContent: string): boolean;
/**
 * Emits run_completed.json and immediately uploads run_completed.marker at the very
 * end of the evaluation suite execution after all tasks finished and logs uploaded.
 */
export declare function uploadRunCompleted(payload: RunCompletedPayload): boolean;
